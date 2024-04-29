import dayjs from "dayjs";
import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

exports.sendNotifications = onSchedule("*/2 * * * *", async (event) => {
  const now = admin.firestore.Timestamp.now();
  const fifteenMinutesLater = new admin.firestore.Timestamp(
    now.seconds + 900,
    now.nanoseconds
  );
  const reservationsRef = admin
    .firestore()
    .collectionGroup("parkingReservations");
  const batch = admin.firestore().batch();

  // Send start notifications
  const startNotificationsSnapshot = await reservationsRef
    .where("startTime", "<=", fifteenMinutesLater)
    .where("startNotificationSent", "==", false)
    .get();

  const startPromises = startNotificationsSnapshot.docs.map((doc) => {
    const data = doc.data();
    if (data && !data.startNotificationSent) {
      return admin
        .firestore()
        .collection("mail")
        .add({
          to: data.userEmail,
          message: {
            subject: "Your Reservation Details",
            html: `Your parking reservation starts soon.<br><strong>Start Time:</strong> ${dayjs(
              new Date(data.startTime.seconds * 1000).toISOString()
            ).format("h:mm A")}<br><strong>End Time:</strong> ${dayjs(
              new Date(data.endTime.seconds * 1000).toISOString()
            ).format("h:mm A")}`,
          },
        })
        .then(() => {
          batch.update(doc.ref, { startNotificationSent: true });
        })
        .catch((error) => {
          console.error("Error sending start notification:", error);
        });
    }
    return null;
  });

  // Send end notifications
  const endNotificationsSnapshot = await reservationsRef
    .where("endTime", "<=", fifteenMinutesLater)
    .where("endNotificationSent", "==", false)
    .get();
  const endPromises = endNotificationsSnapshot.docs.map((doc) => {
    const data = doc.data();
    if (data && !data.endNotificationSent) {
      return admin
        .firestore()
        .collection("mail")
        .add({
          to: data.userEmail,
          message: {
            subject: "Your Reservation is Ends Soon",
            html: `Your parking reservation is ending soon.<br><strong>End Time:</strong> ${dayjs(
              new Date(data.endTime.seconds * 1000).toISOString()
            ).format(
              "h:mm A"
            )}<br>Please ensure you vacate the parking spot on time to avoid any penalties.`,
          },
        })
        .then(() => {
          batch.update(doc.ref, { endNotificationSent: true });
        })
        .catch((error) => {
          console.error("Error sending end notification:", error);
        });
    }
    return null;
  });

  await Promise.all([...startPromises, ...endPromises]);

  await batch.commit();
});
