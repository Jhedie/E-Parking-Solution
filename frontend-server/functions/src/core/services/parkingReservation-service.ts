import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/parkingReservation-firestore-model";
import { PartialParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/partial-parkingReservation-firestore-model";
import { ParkingReservation } from "../data/parkingReservation";
import FieldValue = firestore.FieldValue;

class ParkingReservationService {
  //Top level collection
  private parkingReservationsTopLevelCollection() {
    return admin.firestore().collection("parkingReservations");
  }

  private usersCollection() {
    return admin.firestore().collection("parkingOwner");
  }

  private parkingLotsCollection(userId: string) {
    return this.usersCollection().doc(userId).collection("parkingLots");
  }

  private parkingSlotsCollection(userId: string, lotId: string) {
    return this.parkingLotsCollection(userId)
      .doc(lotId)
      .collection("parkingSlots");
  }

  private parkingReservationsCollection(
    userId: string,
    lotId: string,
    slotId: string
  ) {
    return this.parkingSlotsCollection(userId, lotId)
      .doc(slotId)
      .collection("parkingReservations");
  }

  private parkingReservationDoc(
    userId: string,
    lotId: string,
    slotId: string,
    reservationId?: string
  ) {
    return reservationId
      ? this.parkingReservationsCollection(userId, lotId, slotId).doc(
          reservationId
        )
      : this.parkingReservationsCollection(userId, lotId, slotId).doc();
  }

  async createParkingReservation(
    lotId: string,
    slotId: string,
    reservation: ParkingReservation
  ): Promise<ParkingReservation> {
    let ownerId: string = await this.getParkingOwner(lotId);

    const db = admin.firestore();
    return db
      .runTransaction(async (transaction) => {
        const reservationRef = this.parkingReservationDoc(
          ownerId,
          lotId,
          slotId
        );

        const documentData = ParkingReservationFirestoreModel.fromEntity(
          reservation
        ).toDocumentData(FieldValue.serverTimestamp(), reservationRef.id);

        // Use the transaction to set the new reservation
        transaction.set(reservationRef, documentData);

        // Add reservation to top level collection
        const topLevelRef = this.parkingReservationsTopLevelCollection().doc(
          reservationRef.id
        );

        transaction.set(topLevelRef, documentData);

        // Increment parking lot occupancy
        const lotRef = this.parkingLotsCollection(ownerId).doc(lotId);
        transaction.update(lotRef, { Occupancy: FieldValue.increment(1) });

        return documentData;
      })
      .then((documentData) => {
        // Return the new reservation with its Firestore-generated ID
        return ParkingReservationFirestoreModel.fromDocumentData(documentData);
      })
      .catch((error) => {
        console.error("Transaction failed: ", error);
        throw new Error("Failed to create parking reservation.");
      });
  }

  async extendParkingReservationById(
    lotId: string,
    slotId: string,
    reservationId: string,
    newEndTime: firestore.Timestamp // Assuming newEndTime is a Firestore Timestamp for consistency
  ): Promise<void> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const db = admin.firestore();

    await db.runTransaction(async (transaction) => {
      const reservationRef = this.parkingReservationDoc(
        ownerId,
        lotId,
        slotId,
        reservationId
      );
      const reservationSnapshot = await transaction.get(reservationRef);

      if (!reservationSnapshot.exists) {
        throw new Error("Reservation does not exist.");
      }

      const reservation = reservationSnapshot.data() as ParkingReservation;
      // Check if the new end time is later than the current end time
      if (newEndTime.toDate() <= reservation.endTime) {
        throw new Error(
          "New end time must be later than the current end time."
        );
      }

      // Optional: Check for conflicting reservations
      const conflictingReservationsQuery = this.parkingReservationsCollection(
        ownerId,
        lotId,
        slotId
      )
        .where("startTime", "<", newEndTime)
        .where("endTime", ">", reservation.endTime); // Only check reservations that start after the current end time and before the new end time

      const conflictingReservationsSnapshot = await transaction.get(
        conflictingReservationsQuery
      );
      if (!conflictingReservationsSnapshot.empty) {
        throw new Error(
          "The slot is already booked for part of the requested extension period."
        );
      }

      // Update the reservation with the new end time
      transaction.update(reservationRef, { endTime: newEndTime });

      //add the rate to the updatedRates array
      //add to the total cost of the reservation
    });
  }

  async getParkingReservationById(
    lotId: string,
    slotId: string,
    reservationId: string
  ): Promise<ParkingReservation | null> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const reservationRes = await this.parkingReservationDoc(
      ownerId,
      lotId,
      slotId,
      reservationId
    ).get();
    if (!reservationRes.exists) {
      return null;
    }
    return ParkingReservationFirestoreModel.fromDocumentData(
      reservationRes.data()
    );
  }

  async getAllParkingReservations(
    lotId: string,
    slotId: string
  ): Promise<ParkingReservation[]> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const snapshot = await this.parkingReservationsCollection(
      ownerId,
      lotId,
      slotId
    ).get();
    return snapshot.docs.map((doc) =>
      ParkingReservationFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async updateParkingReservationById(
    lotId: string,
    slotId: string,
    reservationId: string,
    partialReservation: Partial<Record<keyof ParkingReservation, any>>
  ): Promise<void> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const reservationRef = this.parkingReservationDoc(
      ownerId,
      lotId,
      slotId,
      reservationId
    );
    const documentData =
      PartialParkingReservationFirestoreModel.fromPartialEntity(
        partialReservation
      ).toDocumentData();

    await reservationRef.update(documentData);

    // Update reservation in top level collection
    this.parkingReservationsTopLevelCollection()
      .doc(reservationId)
      .update(documentData);
  }

  async deleteParkingReservationById(
    lotId: string,
    slotId: string,
    reservationId: string
  ): Promise<void> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const reservationRef = this.parkingReservationDoc(
      ownerId,
      lotId,
      slotId,
      reservationId
    );
    await reservationRef.delete();

    // Delete reservation from top level collection
    this.parkingReservationsTopLevelCollection().doc(reservationId).delete();

    // Decrement parking lot occupancy
    await this.decrementParkingLotOccupancy(ownerId, lotId);
  }

  async getParkingReservationsByUserId(
    userId: string
  ): Promise<ParkingReservation[]> {
    const reservations: ParkingReservation[] = [];
    const groupSnapshot = await admin
      .firestore()
      .collectionGroup("parkingReservations")
      .where("userId", "==", userId)
      .orderBy("createdAt", "asc")
      .get();

    groupSnapshot.forEach((doc) => {
      console.log("doc", doc.data());
      reservations.push(
        ParkingReservationFirestoreModel.fromDocumentData(doc.data())
      );
    });
    console.log("reservations", reservations);
    return reservations;
  }

  private async getParkingOwner(lotId: string): Promise<string> {
    // Get all users with the role 'parkingOwner'
    const parkingOwnerSnapshot = await admin
      .firestore()
      .collection("parkingOwner")
      .get();

    // Find the user who owns the parking lot
    for (const parkingOwnerDoc of parkingOwnerSnapshot.docs) {
      const parkingLotsSnapshot = await parkingOwnerDoc.ref
        .collection("parkingLots")
        .get();
      for (const parkingLotDoc of parkingLotsSnapshot.docs) {
        if (parkingLotDoc.id === lotId) {
          return parkingOwnerDoc.id;
        }
      }
    }

    throw new Error(
      `Parking lot with ID ${lotId} does not have an identifiable owner.`
    );
  }

  private async decrementParkingLotOccupancy(
    ownerId: string,
    lotId: string
  ): Promise<void> {
    const lotRef = this.parkingLotsCollection(ownerId).doc(lotId);
    await lotRef.update({
      occupancy: admin.firestore.FieldValue.increment(-1),
    });
  }
}

export const parkingReservationService = new ParkingReservationService();
