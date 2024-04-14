import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingLotRateFirestoreModel } from "../data/models/parkingLotRates/firestore/parkingLotRate-firebase-model";
import { PartialParkingLotRateFirestoreModel } from "../data/models/parkingLotRates/firestore/partial-parkingLotRate-firebase-model";
import { ParkingLotRate } from "../data/parkingLotRates";

import FieldValue = firestore.FieldValue;

class ParkingLotRatesService {
  private collection() {
    return admin.firestore().collection("parkingLotRates");
  }

  private doc(rateId?: string) {
    if (!rateId) return this.collection().doc();
    return this.collection().doc(rateId);
  }

  async createParkingLotRate(
    parkingLotRate: ParkingLotRate
  ): Promise<ParkingLotRate> {
    const parkingLotExists = await this.checkParkingLotExists(
      parkingLotRate.lotId
    );
    if (!parkingLotExists) {
      throw new Error(
        `Parking lot with ID ${parkingLotRate.lotId} does not exist.`
      );
    }

    const rateTypeExists = await this.checkRateTypeExists(
      parkingLotRate.lotId,
      parkingLotRate.rateType,
      parkingLotRate.duration
    );
    if (rateTypeExists) {
      throw new Error(
        `Rate type ${parkingLotRate.rateType} already exists for parking lot ID ${parkingLotRate.lotId}.`
      );
    }

    const rateRef = this.doc(); // Creates a new document reference for the parking lot rate
    const documentData = ParkingLotRateFirestoreModel.fromEntity(
      parkingLotRate
    ).toDocumentData(rateRef.id, FieldValue.serverTimestamp());

    await rateRef.set(documentData); // Set the document data in Firestore

    // Return the ParkingLotRateFirestoreModel from the new parking lot rate document
    return ParkingLotRateFirestoreModel.fromDocumentData(
      (await rateRef.get()).data()
    );
  }

  async createMultipleParkingLotRates(
    parkingLotRates: ParkingLotRate[]
  ): Promise<ParkingLotRate[]> {
    const batch = admin.firestore().batch();
    const rateRefs: firestore.DocumentReference[] = [];

    for (const rate of parkingLotRates) {
      const rateRef = this.collection().doc(); // Automatically generate a new document ID
      const documentData = ParkingLotRateFirestoreModel.fromEntity(
        rate
      ).toDocumentData(rateRef.id, FieldValue.serverTimestamp());

      batch.set(rateRef, documentData);
      rateRefs.push(rateRef);
    }

    await batch.commit(); // Commit the batch operation

    // Fetch the actual documents to get the server-set timestamps
    const fetchPromises = rateRefs.map((ref) => ref.get());
    const docs = await Promise.all(fetchPromises);

    const createdRates = docs.map((doc) => {
      // Ensure the document exists and has data
      if (!doc.exists) {
        throw new Error("Failed to fetch created parking lot rate.");
      }
      const data = doc.data();
      // Convert the document data to a ParkingLotRate object
      return ParkingLotRateFirestoreModel.fromDocumentData(data);
    });

    return createdRates;
  }

  async getParkingLotRateById(rateId: string): Promise<ParkingLotRate | null> {
    const rateRes = await this.collection().doc(rateId).get();
    if (!rateRes.exists) {
      return null;
    }
    return ParkingLotRateFirestoreModel.fromDocumentData(rateRes.data());
  }

  // getAllParkingLotRatesByParkingLotId
  async getAllParkingLotRatesByParkingLotId(
    lotId: string
  ): Promise<ParkingLotRate[]> {
    const snapshot = await this.collection().where("lotId", "==", lotId).get();

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) =>
      ParkingLotRateFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async getAllParkingLotRates(): Promise<ParkingLotRate[]> {
    const snapshot = await this.collection().get();
    return snapshot.docs.map((doc) =>
      ParkingLotRateFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async updateParkingLotRateById(
    rateId: string,
    partialRate: Partial<Record<keyof ParkingLotRate, any>>
  ): Promise<void> {
    const rateRef = this.doc(rateId);
    const documentData =
      PartialParkingLotRateFirestoreModel.fromPartialEntity(
        partialRate
      ).toDocumentData();
    await rateRef.update(documentData);
  }

  async deleteParkingLotRateById(rateId: string): Promise<void> {
    await this.doc(rateId).delete();
  }

  //helpers
  async checkParkingLotExists(lotId: string): Promise<boolean> {
    const lotRef = admin.firestore().collection("parkingLots").doc(lotId);
    const lotSnapshot = await lotRef.get();
    return lotSnapshot.exists;
  }

  async checkRateTypeExists(
    lotId: string,
    rateType: string,
    duration: number
  ): Promise<boolean> {
    const ratesRef = admin
      .firestore()
      .collection("parkingLotRates")
      .where("lotId", "==", lotId)
      .where("rateType", "==", rateType)
      .where("duration", "==", duration);
    const snapshot = await ratesRef.get();
    return !snapshot.empty;
  }
}

export const parkingLotRatesService = new ParkingLotRatesService();
