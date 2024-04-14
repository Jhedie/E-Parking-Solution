import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import QRCode from "qrcode";
import { ParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/parkingReservation-firestore-model";
import { PartialParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/partial-parkingReservation-firestore-model";
import { ParkingReservation } from "../data/parkingReservation";
import FieldValue = firestore.FieldValue;

class ParkingReservationService {
  private usersCollection() {
    return admin.firestore().collection("users");
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

    const reservationRef = this.parkingReservationDoc(ownerId, lotId, slotId);

    const qrCodeData = JSON.stringify({
      lotId,
      slotId,
      reservationId: reservationRef.id,
      ...reservation,
    });
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: "H", // High error correction level meaning more data can be stored in the QR code
    });

    const documentData = ParkingReservationFirestoreModel.fromEntity(
      reservation
    ).toDocumentData(
      qrCodeUrl,
      FieldValue.serverTimestamp(),
      reservationRef.id
    );

    await reservationRef.set(documentData);

    // Return the new reservation with its Firestore-generated ID
    return ParkingReservationFirestoreModel.fromDocumentData(
      (await reservationRef.get()).data()
    );
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
    const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .where("role", "==", "parkingOwner")
      .get();

    for (const userDoc of usersSnapshot.docs) {
      // For each user, check their 'parkingLots' subcollection for the lotId
      const lotsSnapshot = await userDoc.ref
        .collection("parkingLots")
        .where(admin.firestore.FieldPath.documentId(), "==", lotId)
        .get();

      if (!lotsSnapshot.empty) {
        // Found the lotId within this user's subcollection
        return userDoc.id; // Return the userId of the parking lot owner
      }
    }

    throw new Error(
      `Parking lot with ID ${lotId} does not have an identifiable owner.`
    );
  }
}

export const parkingReservationService = new ParkingReservationService();
