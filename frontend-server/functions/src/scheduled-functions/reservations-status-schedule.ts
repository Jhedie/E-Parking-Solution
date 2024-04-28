import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

exports.updateReservationStatuses = onSchedule("* * * * *", async (event) => {
  const now = admin.firestore.Timestamp.now();
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
    .where("startTime", "<", now)
    .where("checkedIn", "==", false)
    .where("parkingStatus", "==", "pending")
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

  await batch.commit();
});
