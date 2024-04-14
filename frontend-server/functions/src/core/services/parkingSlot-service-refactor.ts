import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingSlotFirestoreModel } from "../data/models/parkingSlot/firestore/parkingSlot-firestore-model";
import { PartialParkingSlotFirestoreModel } from "../data/models/parkingSlot/firestore/partial-parkingSlot-firestore-model";
import { ParkingSlot } from "../data/parkingSlot";
import FieldValue = firestore.FieldValue;

class ParkingSlotService {

  private parkingLotsCollection(ownerId: string) {
    return admin
      .firestore()
      .collection("users")
      .doc(ownerId)
      .collection("parkingLots");
  }

  private parkingSlotsCollection(ownerId: string, lotId: string) {
    return this.parkingLotsCollection(ownerId)
      .doc(lotId)
      .collection("parkingSlots");
  }

  private parkingSlotDoc(
    ownerId: string,
    lotId: string,
    slotId?: string
  ): firestore.DocumentReference {
    return slotId
      ? this.parkingSlotsCollection(ownerId, lotId).doc(slotId)
      : this.parkingSlotsCollection(ownerId, lotId).doc();
  }

  async createParkingSlot(
    parkingSlot: ParkingSlot,
    ownerId: string,
    lotId: string
  ): Promise<ParkingSlot> {
    const parkingSlotRef = this.parkingSlotDoc(ownerId, lotId); // Creates a new document reference for the parking slot
    const documentData = ParkingSlotFirestoreModel.fromEntity(
      parkingSlot
    ).toDocumentData(parkingSlotRef.id, FieldValue.serverTimestamp());

    await parkingSlotRef.set(documentData); // Set the document data in Firestore

    // Return the ParkingSlotFirestoreModel from the new parking slot document
    return ParkingSlotFirestoreModel.fromDocumentData(
      (await parkingSlotRef.get()).data()
    );
  }

  async createMultipleParkingSlots(
    parkingSlots: ParkingSlot[],
    ownerId: string,
    lotId: string,
    transaction?: firestore.Transaction
  ): Promise<ParkingSlot[]> {
    const batch = admin.firestore().batch();
    const parkingSlotRefs: firestore.DocumentReference[] = [];

    for (const parkingSlot of parkingSlots) {
      const parkingSlotRef = this.parkingSlotsCollection(ownerId, lotId).doc(); // Automatically generate a new document ID
      const documentData = ParkingSlotFirestoreModel.fromEntity(
        parkingSlot
      ).toDocumentData(parkingSlotRef.id, FieldValue.serverTimestamp());

      batch.set(parkingSlotRef, documentData);
      parkingSlotRefs.push(parkingSlotRef);
    }

    await batch.commit(); // Commit the batch operation

    // Fetch the actual documents to get the server-set timestamps
    const fetchPromises = parkingSlotRefs.map((ref) => ref.get());
    const docs = await Promise.all(fetchPromises);

    const createdParkingSlots = docs.map((doc) => {
      // Ensure the document exists and has data
      if (!doc.exists) {
        throw new Error("Failed to fetch created parking slot.");
      }
      const data = doc.data();
      // Convert the document data to a ParkingSlot object
      return ParkingSlotFirestoreModel.fromDocumentData(data);
    });

    return createdParkingSlots;
  }

  async getParkingSlotById(
    ownerId: string,
    lotId: string,
    slotId: string
  ): Promise<ParkingSlot | null> {
    const parkingSlotRes = await this.parkingSlotDoc(ownerId, lotId, slotId).get();
    if (!parkingSlotRes.exists) {
      return null;
    }
    return ParkingSlotFirestoreModel.fromDocumentData(parkingSlotRes.data());
  }

  async getParkingSlots(ownerId: string, lotId: string): Promise<ParkingSlot[]> {
    const snapshot = await this.parkingSlotsCollection(ownerId, lotId).get();
    return snapshot.docs.map((doc) =>
      ParkingSlotFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async updateParkingSlotById(
    ownerId: string,
    lotId: string,
    slotId: string,
    partialParkingSlot: Partial<Record<keyof ParkingSlot, any>>
  ): Promise<void> {
    const parkingSlotRef = this.parkingSlotDoc(ownerId, lotId, slotId);
    const documentData =
      PartialParkingSlotFirestoreModel.fromPartialEntity(
        partialParkingSlot
      ).toDocumentData();
    await parkingSlotRef.update(documentData);
  }

  async deleteParkingSlotById(
    ownerId: string,
    lotId: string,
    slotId: string
  ): Promise<void> {
    await this.parkingSlotDoc(ownerId, lotId, slotId).delete();
  }

  async getParkingSlotsByLotId(
    ownerId: string,
    lotId: string
  ): Promise<ParkingSlot[]> {
    const snapshot = await this.parkingSlotsCollection(ownerId, lotId).where("lotId", "==", lotId).get();
    return snapshot.docs.map((doc) =>
      ParkingSlotFirestoreModel.fromDocumentData(doc.data())
    );
  }


  async deleteParkingSlotsByLotId(
    ownerId: string,
    lotId: string
  ): Promise<void> {
    const snapshot = await this.parkingSlotsCollection(ownerId, lotId).where("lotId", "==", lotId).get();
    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

export const parkingSlotService = new ParkingSlotService();
