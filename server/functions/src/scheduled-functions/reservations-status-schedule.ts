import dayjs from "dayjs";
import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

exports.updateReservationStatuses = onSchedule("* * * * *", async (event) => {
  const now = admin.firestore.Timestamp.now();
  const adminEmail = process.env.ADMIN_EMAIL;
  const reservationsRef = admin
    .firestore()
    .collectionGroup("parkingReservations");
  const batch = admin.firestore().batch();

  // Handle expired reservations
  const expiredReservationsSnapshot = await reservationsRef
    .where("endTime", "<", now)
    .where("parkingStatus", "!=", "expired")
    .get();
  expiredReservationsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data && data.parkingStatus !== "expired") {
      batch.update(doc.ref, { parkingStatus: "expired" });
    }
  });

  // Handle no show reservations
  const noShowReservationsSnapshot = await reservationsRef
    .where("endTime", "<", now) // Check if the reservation end time has passed
    .where("checkedIn", "==", false)
    .where("parkingStatus", "==", "active")
    .get();
  noShowReservationsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data && data.parkingStatus !== "no show") {
      batch.update(doc.ref, { parkingStatus: "no show" });
    }
  });

  // Handle active reservations
  const activeReservationsSnapshot = await reservationsRef
    .where("startTime", "<=", now)
    .where("endTime", ">", now)
    .where("parkingStatus", "==", "pending")
    .get();
  activeReservationsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data && data.parkingStatus !== "active") {
      batch.update(doc.ref, { parkingStatus: "active" });
    }
  });

  // Handle overstayed reservations (Checked In but not Checked Out)
  const overstayedReservationsSnapshot = await reservationsRef
    .where("endTime", "<", now)
    .where("checkedIn", "==", true)
    .where("checkedOut", "==", false)
    .where("overStayedHandled", "==", false)
    .get();
  overstayedReservationsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data) {
      batch.update(doc.ref, {
        parkingStatus: "overstayed",
        overStayedHandled: true,
      });
    }
    //inform the user via email that they have overstayed
    admin
      .firestore()
      .collection("mail")
      .add({
        to: data.userEmail,
        message: {
          subject: "Alert: You Have Overstayed Your Reservation",
          html: `You have overstayed your parking reservation.<br><strong>End Time:</strong> ${dayjs(
            new Date(data.endTime.seconds * 1000).toISOString()
          ).format(
            "h:mm A"
          )}<br>Please vacate the parking spot immediately to avoid further penalties.`,
        },
      })
      .then(() => {
        batch.update(doc.ref, { endNotificationSent: true });
        // Notify admin about the overstayed reservation
        admin
          .firestore()
          .collection("mail")
          .add({
            to: adminEmail,
            message: {
              subject: "Overstayed Reservation Alert",
              html: `User with email ${
                data.userEmail
              } has overstayed their reservation.<br><strong>End Time:</strong> ${dayjs(
                new Date(data.endTime.seconds * 1000).toISOString()
              ).format("h:mm A")}`,
            },
          });
      })
      .catch((error) => {
        console.error("Error sending overstayed notification:", error);
      });
  });

  await batch.commit();
});
