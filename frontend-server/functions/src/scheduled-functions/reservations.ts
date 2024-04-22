import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

exports.reservationStatusUpdater = onSchedule(
  "every 5 minutes",
  async (event) => {
    const now = admin.firestore.Timestamp.now();
    const reservationsRef = admin
      .firestore()
      .collectionGroup("parkingReservations");

    // Example: Update parkingStatus to 'Expired' for past reservations
    const expiredReservationsSnapshot = await reservationsRef
      .where("endTime", "<", now)
      .where("parkingStatus", "!=", "Expired") // Assuming 'Expired' is one of the statuses
      .get();

    const batch = admin.firestore().batch();

    expiredReservationsSnapshot.forEach((doc) => {
      batch.update(doc.ref, { parkingStatus: "Expired" });
    });

    // Add more conditions for other status updates as needed

    //update the occupancy of the parkingLot

    await batch.commit();
  }
);
