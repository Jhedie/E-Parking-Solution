import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

//runs every minute
exports.reservationStatusUpdater = onSchedule("* * * * *", async (event) => {
  const now = admin.firestore.Timestamp.now();

  // Create a new Timestamp object that represents the current time plus 15 minutes
  const fifteenMinutesLater = new admin.firestore.Timestamp(
    now.seconds + 900,
    now.nanoseconds
  );
  const adminEmail = process.env.ADMIN_EMAIL;

  const reservationsRef = admin
    .firestore()
    .collectionGroup("parkingReservations");
  const batch = admin.firestore().batch();

  // Expired reservations
  const expiredReservationsSnapshot = await reservationsRef
    .where("endTime", "<", now)
    .where("parkingStatus", "!=", "expired")
    .get();
  expiredReservationsSnapshot.forEach((doc) => {
    const data = doc.data();
    //prevent parking status from being updated if the reservation has already been marked as expired
    if (data.parkingStatus !== "expired") {
      batch.update(doc.ref, { parkingStatus: "expired" });
    }
  });

  // No show reservations
  const noShowReservationsSnapshot = await reservationsRef
    .where("startTime", "<", now)
    .where("checkedIn", "==", false)
    .where("parkingStatus", "==", "pending")
    .get();
  noShowReservationsSnapshot.forEach((doc) => {
    const data = doc.data();
    //prevent parking status from being updated if the reservation has already been marked as no show
    if (data.parkingStatus !== "no show") {
      batch.update(doc.ref, { parkingStatus: "no show" });
    }
  });

  // Active reservations
  const activeReservationsSnapshot = await reservationsRef
    .where("startTime", "<=", now)
    .where("endTime", ">", now)
    .where("parkingStatus", "==", "pending")
    .get();
  activeReservationsSnapshot.forEach((doc) => {
    const data = doc.data();
    //prevent parking status from being updated if the reservation has already been marked as active
    if (data.parkingStatus !== "active") {
      batch.update(doc.ref, { parkingStatus: "active" });
    }
  });

  // Send notifications for upcoming reservation starts

  // retrieve documents from a Firestore collection where
  //reservation start and end times are within fifteen minutes
  //of the current time.

  /**
   * Purpose: To find all parking reservations whose start times are imminent (within the next fifteen minutes).
   * where("startTime", "<=", fifteenMinutesLater): This condition filters documents where the startTime is less than or equal to fifteen minutes from the current time. It helps identify all reservations that are about to start soon.
   * where("startNotificationSent", "==", false): This condition checks if the start notification has not been sent for the reservation. It helps to prevent duplicate notifications.
   */
  const startNotificationsSnapshot = await reservationsRef
    .where("startTime", "<=", fifteenMinutesLater)
    .where("startNotificationSent", "==", false) // Check if the start notification has not been sent
    .get();

  startNotificationsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (!data.startNotificationSent) {
      // Double-check to prevent race conditions

      admin
        .firestore()
        .collection("mail")
        .add({
          to: data.userEmail,
          message: {
            subject: "Your Reservation Details",
            html: `Your parking reservation starts in 15 minutes.<br><strong>Start Time:</strong> ${new Date(
              data.startTime
            ).toTimeString()}<br><strong>End Time:</strong> ${new Date(
              data.endTime
            ).toTimeString()}<br><strong>Duration:</strong> ${
              data.duration
            }<br><strong>Total Amount:</strong> ${data.totalAmount.toString()}`,
          },
        })
        .then(() => {
          console.log("Start notification email queued for sending.");
          batch.update(doc.ref, { startNotificationSent: true }); // Mark as notified
        })
        .catch((error) => {
          console.error("Failed to queue start notification email: ", error);
        });
    }
  });

  // Send notifications for upcoming reservation ends
  /**
   * Purpose: To find all parking reservations whose end times are imminent (within the next fifteen minutes).
   * where("endTime", "<=", fifteenMinutesLater): This condition filters documents where the endTime is less than or equal to fifteen minutes from the current time. It helps identify all reservations that are about to end soon.
   * where("endNotificationSent", "==", false): This condition checks if the end notification has not been sent for the reservation. It helps to prevent duplicate notifications.
   */
  const endNotificationsSnapshot = await reservationsRef
    .where("endTime", "<=", fifteenMinutesLater)
    .where("endNotificationSent", "==", false) // Check if the end notification has not been sent
    .get();

  endNotificationsSnapshot.forEach((doc) => {
    const data = doc.data();
    if (!data.endNotificationSent) {
      admin
        .firestore()
        .collection("mail")
        .add({
          to: data.userEmail,
          message: {
            subject: "Your Reservation is Ending Soon",
            html: `Your parking reservation is ending in 15 minutes.<br><strong>End Time:</strong> ${new Date(
              data.endTime
            ).toTimeString()}<br>Please ensure you vacate the parking spot on time to avoid any penalties.`,
          },
        })
        .then(() => {
          console.log("End notification email queued for sending.");
          batch.update(doc.ref, { endNotificationSent: true }); // Mark as end notified
        })
        .catch((error) => {
          console.error("Failed to queue end notification email: ", error);
        });
    }
  });

  //update the occupancy levels of all parking lots
  await updateOccupancyLevels();

  //check for overstayed reservations
  const overstayedReservations = await reservationsRef
    .where("endTime", "<", now)
    .where("checkedIn", "==", true)
    .where("overStayedHandled", "==", false)
    .get();

  overstayedReservations.forEach((doc) => {
    const data = doc.data();

    admin
      .firestore()
      .collection("mail")
      .add({
        to: data.userEmail,
        message: {
          subject: "Overstaying Alert",
          html: `<strong>Your parking reservation ${data.reservationId} has expired. Please vacate the slot.</strong>`,
        },
      })
      .then(() => {
        console.log("Overstay alert email queued for sending.");
        batch.update(doc.ref, { overstayHandled: true }); // Mark the overstay as handled
      })
      .catch((error) => {
        console.error("Failed to queue overstay alert email: ", error);
      });
  });
  // Commit all updates
  await batch.commit();
});

/**
 * Purpose: To update the occupancy levels of all parking lots.
 * This function retrieves all parking lots and their current occupancy levels.
 * It then updates the occupancy level of each parking lot by counting the number of active reservations for that lot.
 * The updated occupancy levels are then saved back to the parking lot document.
 */
async function updateOccupancyLevels() {
  const now = admin.firestore.Timestamp.now();
  const parkingLotsRef = admin.firestore().collectionGroup("parkingLots");

  const parkingLotsSnapshot = await parkingLotsRef.get();

  parkingLotsSnapshot.forEach(async (lotDoc) => {
    const lotId = lotDoc.id;
    const reservationsRef = admin
      .firestore()
      .collectionGroup("parkingReservations")
      .where("lotId", "==", lotId)
      .where("startTime", "<=", now)
      .where("endTime", ">=", now);

    const activeReservationsSnapshot = await reservationsRef.get();
    //get unique reservations
    const uniqueReservations = new Set(
      activeReservationsSnapshot.docs.map((doc) => doc.data().reservationId)
    );
    const activeCount = uniqueReservations.size;

    // Update the parking lot document with the new occupancy count
    lotDoc.ref.update({
      Occupancy: activeCount,
    });
  });
}
