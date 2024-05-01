import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

exports.updateParkingSlotStatus = onSchedule("* * * * *", async (event) => {
  const now = admin.firestore.Timestamp.now();
  const db = admin.firestore();
  const batch = db.batch();
  const slotsRef = db.collectionGroup("parkingSlots");
  const reservationsRef = db.collectionGroup("parkingReservations");

  try {
    /**
     * Purpose: To update the status of all parking slots.
     * This function retrieves all parking slots and their current status.
     * It then updates the status of each slot by checking if there are any active reservations for that slot.
     * If there are active reservations, the slot is marked as "Reserved".
     * If there are no active reservations, the slot is marked as "Available".
     */
    const slotsSnapshot = await slotsRef.get();
    for (const slotDoc of slotsSnapshot.docs) {
      const slotId = slotDoc.id;
      const activeReservationsSnapshot = await reservationsRef
        .where("slotId", "==", slotId)
        .where("startTime", "<=", now)
        .where("endTime", ">=", now)
        .get();

      const status = activeReservationsSnapshot.empty
        ? "Available"
        : "Reserved";
      batch.update(slotDoc.ref, { status: status });
    }

    /**
     * Purpose: To update the occupancy levels of all parking lots.
     * This function retrieves all parking lots and their current occupancy levels.
     * It then updates the occupancy level of each parking lot by counting the number of active reservations for that lot.
     * The updated occupancy levels are then saved back to the parking lot document.
     */
    const parkingLotsRef = db.collectionGroup("parkingLots");
    const parkingLotsSnapshot = await parkingLotsRef.get();
    for (const lotDoc of parkingLotsSnapshot.docs) {
      const lotId = lotDoc.id;
      const activeReservationsSnapshot = await reservationsRef
        .where("lotId", "==", lotId)
        .where("startTime", "<=", now)
        .where("endTime", ">=", now)
        .get();

      const uniqueReservations = new Set(
        activeReservationsSnapshot.docs.map((doc) => doc.data().reservationId)
      );
      const activeCount = uniqueReservations.size;
      batch.update(lotDoc.ref, { Occupancy: activeCount });
    }

    await batch.commit();
  } catch (error) {
    console.error("Failed to update parking slots and lots: ", error);
  }
});
