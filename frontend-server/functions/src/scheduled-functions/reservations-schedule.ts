import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

exports.reservationStatusUpdater = onSchedule(
  "every 2 minutes",
  async (event) => {
    const now = admin.firestore.Timestamp.now();
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
      batch.update(doc.ref, { parkingStatus: "expired" });
    });

    // No show reservations
    const noShowReservationsSnapshot = await reservationsRef
      .where("startTime", "<", now)
      .where("checkedIn", "==", false)
      .where("parkingStatus", "==", "pending")
      .get();
    noShowReservationsSnapshot.forEach((doc) => {
      batch.update(doc.ref, { parkingStatus: "no show" });
    });

    // Active reservations
    const activeReservationsSnapshot = await reservationsRef
      .where("startTime", "<=", now)
      .where("endTime", ">", now)
      .where("parkingStatus", "==", "pending")
      .get();
    activeReservationsSnapshot.forEach((doc) => {
      batch.update(doc.ref, { parkingStatus: "active" });
    });

    // Commit all updates
    await batch.commit();
  }
);
