import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingLotRateFirestoreModel } from "../data/models/parkingLotRates/firestore/parkingLotRate-firebase-model";
import { PartialParkingLotRateFirestoreModel } from "../data/models/parkingLotRates/firestore/partial-parkingLotRate-firebase-model";
import { ParkingLotRate } from "../data/parkingLotRates";

import FieldValue = firestore.FieldValue;

class ParkingLotRatesService {
  private parkingLotsCollection(ownerId: string) {
    return admin
      .firestore()
      .collection("parkingOwner")
      .doc(ownerId)
      .collection("parkingLots");
  }

  // Method to get a reference to the parking lot rates subcollection
  private parkingLotRatesCollection(ownerId: string, parkingLotId: string) {
    return this.parkingLotsCollection(ownerId)
      .doc(parkingLotId)
      .collection("parkingLotRates");
  }

  // Method to get a specific parking lot rate document reference
  private parkingLotRateDoc(
    ownerId: string,
    parkingLotId: string,
    rateId?: string
  ) {
    return rateId
      ? this.parkingLotRatesCollection(ownerId, parkingLotId).doc(rateId)
      : this.parkingLotRatesCollection(ownerId, parkingLotId).doc();
  }

  async createParkingLotRate(
    parkingLotRate: ParkingLotRate,
    ownerId: string,
    parkingLotId: string
  ): Promise<ParkingLotRate> {
    const parkingLotExists = await this.parkingLotsCollection(ownerId)
      .doc(parkingLotId)
      .get();
    if (!parkingLotExists) {
      throw new Error(
        `Parking lot with ID ${parkingLotRate.lotId} does not exist.`
      );
    }

    const rateRef = this.parkingLotRateDoc(ownerId, parkingLotId); // Creates a new document reference for the parking lot rate
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
    parkingLotRates: ParkingLotRate[],
    ownerId: string,
    parkingLotId: string
  ): Promise<ParkingLotRate[]> {
    const batch = admin.firestore().batch();
    const rateRefs: firestore.DocumentReference[] = [];

    for (const rate of parkingLotRates) {
      const rateRef = this.parkingLotRateDoc(ownerId, parkingLotId); // Automatically generate a new document ID
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

  async getParkingLotRateById(
    ownerId: string,
    parkingLotId: string,
    rateId: string
  ): Promise<ParkingLotRate | null> {
    // get the owner based on the parkingLotId
    const parkingLot = await this.parkingLotsCollection(ownerId).doc(parkingLotId).get();
    if (!parkingLot.exists) {
      throw new Error(`Parking lot with ID ${parkingLotId} does not exist.`);
    }
    const rateRes = await this.parkingLotRateDoc(
      ownerId,
      parkingLotId,
      rateId
    ).get();
    if (!rateRes.exists) {
      return null;
    }
    return ParkingLotRateFirestoreModel.fromDocumentData(rateRes.data());
  }

  // getAllParkingLotRatesByParkingLotId
  async getAllParkingLotRatesByParkingLotId(
    ownerId: string,
    parkingLotId: string
  ): Promise<ParkingLotRate[]> {
    const snapshot = await this.parkingLotRatesCollection(
      ownerId,
      parkingLotId
    ).get();

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc) =>
      ParkingLotRateFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async updateParkingLotRateById(
    rateId: string,
    partialRate: Partial<Record<keyof ParkingLotRate, any>>,
    ownerId: string,
    parkingLotId: string
  ): Promise<void> {
    const rateRef = this.parkingLotRateDoc(ownerId, parkingLotId, rateId);
    const documentData =
      PartialParkingLotRateFirestoreModel.fromPartialEntity(
        partialRate
      ).toDocumentData();
    await rateRef.update(documentData);
  }

  async deleteParkingLotRateById(
    rateId: string,
    ownerId: string,
    parkingLotId: string
  ): Promise<void> {
    await this.parkingLotRateDoc(ownerId, parkingLotId, rateId).delete();
  }
}

export const parkingLotRatesService = new ParkingLotRatesService();
