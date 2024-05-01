import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

/**
 * Schedule: The function is scheduled to run every 5 minutes. You can adjust this frequency based on your needs.
 * Occupancy Calculation: The function calculates the occupancy rate as a percentage and updates the status based on predefined thresholds.
 * Batch Update: It uses a batch update to efficiently handle multiple updates in a single transaction.
 */

exports.parkingLotStatusUpdater = onSchedule("every 5 minutes", async (event) => {
  const lotsRef = admin.firestore().collectionGroup("parkingLots");
  const batch = admin.firestore().batch();

  const lotsSnapshot = await lotsRef.get();
  lotsSnapshot.forEach((doc) => {
    const lot = doc.data();
    const totalSpaces = lot.totalSpaces;
    const occupiedSpaces = lot.occupiedSpaces;

    let newStatus = "Low";
    const occupancyRate = (occupiedSpaces / totalSpaces) * 100;

    if (occupancyRate > 75) {
      newStatus = "High";
    } else if (occupancyRate > 50) {
      newStatus = "Medium";
    }

    // Update the lot status if it has changed
    if (lot.status !== newStatus) {
      batch.update(doc.ref, { LiveStatus: newStatus });
    }
  });

  // Commit all updates
  await batch.commit();
});
