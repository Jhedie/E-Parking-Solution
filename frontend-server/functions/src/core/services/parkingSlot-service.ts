import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingSlotFirestoreModel } from "../data/models/parkingSlot/firestore/parkingSlot-firestore-model";
import { PartialParkingSlotFirestoreModel } from "../data/models/parkingSlot/firestore/partial-parkingSlot-firestore-model";
import { ParkingSlot } from "../data/parkingSlot";
import FieldValue = firestore.FieldValue;

class ParkingSlotService {
  private collection() {
    return admin.firestore().collection("parkingSlots");
  }

  private doc(slotId?: string) {
    if (!slotId) return this.collection().doc();
    return this.collection().doc(slotId);
  }

  async createParkingSlot(parkingSlot: ParkingSlot): Promise<ParkingSlot> {
    const parkingSlotRef = this.doc(); // Creates a new document reference for the parking slot
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
    parkingSlots: ParkingSlot[]
  ): Promise<ParkingSlot[]> {
    const batch = admin.firestore().batch();
    const parkingSlotRefs: firestore.DocumentReference[] = [];

    for (const parkingSlot of parkingSlots) {
      const parkingSlotRef = this.collection().doc(); // Automatically generate a new document ID
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
      // Ensure your fromDocumentData method properly handles the conversion, including the timestamp
      return ParkingSlotFirestoreModel.fromDocumentData({
        ...data,
        slotId: doc.id, // Use the document ID as the slotId
        // The createdAt field will be automatically handled if fromDocumentData is implemented correctly
      });
    });

    return createdParkingSlots;
  }

  async getParkingSlotById(slotId: string): Promise<ParkingSlot | null> {
    const parkingSlotRes = await this.doc(slotId).get();
    if (!parkingSlotRes.exists) {
      return null;
    }
    return ParkingSlotFirestoreModel.fromDocumentData(parkingSlotRes.data());
  }

  async getParkingSlots(): Promise<ParkingSlot[]> {
    const snapshot = await this.collection().get();
    return snapshot.docs.map((doc) =>
      ParkingSlotFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async updateParkingSlotById(
    slotId: string,
    partialParkingSlot: Partial<Record<keyof ParkingSlot, any>>
  ): Promise<void> {
    const db = admin.firestore();
    await db.runTransaction(async (transaction) => {
      const parkingSlotRef = this.doc(slotId);
      // Example logic here: Update the parking slot document with the new data
      const documentData =
        PartialParkingSlotFirestoreModel.fromPartialEntity(
          partialParkingSlot
        ).toDocumentData();
      transaction.update(parkingSlotRef, documentData);
    });
  }

  async deleteParkingSlotById(slotId: string): Promise<void> {
    await admin.firestore().runTransaction(async (transaction) => {
      const parkingSlotRef = this.doc(slotId);
      transaction.delete(parkingSlotRef);
    });
  }

  async getParkingSlotsByLotId(lotId: string): Promise<ParkingSlot[]> {
    const snapshot = await this.collection().where("lotId", "==", lotId).get();
    return snapshot.docs.map((doc) =>
      ParkingSlotFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async deleteAllParkingSlots(): Promise<void> {
    const snapshot = await this.collection().get();
    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  async deleteParkingSlotsByLotId(lotId: string): Promise<void> {
    const snapshot = await this.collection().where("lotId", "==", lotId).get();
    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

export const parkingSlotService = new ParkingSlotService();
