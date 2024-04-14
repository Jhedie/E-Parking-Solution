import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import * as geofirestore from "geofirestore";
import { ParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/parkingLot-firestore-model";
import { PartialParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/partial-parkingLot-firestore-model";
import { ParkingLot } from "../data/parkingLot";

import FieldValue = firestore.FieldValue;

class ParkingLotService {
  private geoFirestore: geofirestore.GeoFirestore;

  private geocollection: geofirestore.GeoCollectionReference;
  /**
   * Explicitly initializes GeoFirestore and related resources.
   * This method should be called after Firebase Admin SDK has been initialized.
   */
  initializeGeoFirestore() {
    const firestoreInstance = admin.firestore();
    this.geoFirestore = geofirestore.initializeApp(firestoreInstance);
    this.geocollection = this.geoFirestore.collection("parkingLotsGeohash");
  }

  private parkingLotsCollection(ownerId: string) {
    return admin
      .firestore()
      .collection("users")
      .doc(ownerId)
      .collection("parkingLots");
  }

  private parkingLotDoc(
    ownerId: string,
    lotId?: string
  ): firestore.DocumentReference {
    return lotId
      ? this.parkingLotsCollection(ownerId).doc(lotId)
      : this.parkingLotsCollection(ownerId).doc();
  }

  /**
   * Creates a new parking lot in the firestore database.
   *
   * @param parkingLot
   * @returns A promise that resolves to the created parkingLot entity.
   */
  async createParkingLot(
    parkingLot: ParkingLot,
    ownerId: string
  ): Promise<ParkingLot> {
    console.log("parkingLot in the service", parkingLot);
    // Get a refernce to a new document with an auto-generated ID in the firebase collection
    const parkingLotRef = this.parkingLotDoc(ownerId);
    console.log("type of lat", typeof parkingLot.Coordinates.Latitude);
    console.log("type of lon", typeof parkingLot.Coordinates.Latitude);
    
    this.geocollection.add({
      coordinates: new firestore.GeoPoint(
        parkingLot.Coordinates.Latitude,
        parkingLot.Coordinates.Longitude
      ),
      ownerId: ownerId,
      lotId: parkingLotRef.id,
    });

    // Convert the product entity to Firestore document data including the auto-generated ID and the server timestamp
    const documentData = ParkingLotFirestoreModel.fromEntity(
      parkingLot
    ).toDocumentData(parkingLotRef.id, FieldValue.serverTimestamp());
    // Set the document data in Firestore
    await parkingLotRef.set(documentData);
    //Get the created document data from Firestore and convert it back to a ParkingLot entity
    return ParkingLotFirestoreModel.fromDocumentData(
      (await parkingLotRef.get()).data()
    );
  }

  /**
   * Returns a list of all parking lots in the firestore database.
   * @returns A promise that resolves to an array of all parking lots in the firestore database.
   */
  async getParkingLots(ownerId: string): Promise<ParkingLot[]> {
    // Fetch all documents from the collection
    const snapshot = await this.parkingLotsCollection(ownerId).get();
    // Convert each document to a ParkingLot object and return the array
    return snapshot.docs.map((doc) =>
      ParkingLotFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async getParkingLotById(
    ownerId: string,
    parkingLotId: string
  ): Promise<ParkingLot | null> {
    const parkingLotResult = await this.parkingLotDoc(
      ownerId,
      parkingLotId
    ).get();
    if (!parkingLotResult.exists) {
      return null;
    }
    return ParkingLotFirestoreModel.fromDocumentData(parkingLotResult.data());
  }

  async updateParkingLotById(
    ownerId: string,
    parkingLotId: string,
    partialParkingLot: Partial<Record<keyof ParkingLot, any>>
  ): Promise<void> {
    //convert the partial parking lot data to a format suitable for updating the document
    const documentData =
      PartialParkingLotFirestoreModel.fromPartialEntity(
        partialParkingLot
      ).toDocumentData();

    // Update the parking lot document with the new data
    await this.parkingLotDoc(ownerId, parkingLotId).update(documentData);
  }

  //TODO: TO be refactored
  // async deleteParkingLotById(
  //   ownerId: string,
  //   parkingLotId: string
  // ): Promise<void> {
  //   // Delete the parking slots associated with the parking lot
  //   await this.deleteParkingSlotsByParkingLotId(parkingLotId);

  //   //Delete the parking lot rates associated with the parking lot
  //   await this.deleteParkingLotRatesByParkingLotId(parkingLotId);

  //   // Delete the parking lot document
  //   await this.parkingLotDoc(ownerId, parkingLotId).delete();
  // }

  //TODO: TO be refactored
  // private async deleteParkingLotRatesByParkingLotId(
  //   parkingLotId: string
  // ): Promise<void> {
  //   // Get a reference to the parking lot rates collection
  //   const parkingLotRatesCollection = admin
  //     .firestore()
  //     .collection("parkingLotRates");

  //   // Query the parking lot rates collection for rates associated with the parking lot
  //   const parkingLotRatesQuery = parkingLotRatesCollection.where(
  //     "lotId",
  //     "==",
  //     parkingLotId
  //   );

  //   // Get the parking lot rates associated with the parking lot
  //   const parkingLotRatesSnapshot = await parkingLotRatesQuery.get();

  //   // Delete the parking lot rates
  //   const deletePromises = parkingLotRatesSnapshot.docs.map((doc) =>
  //     doc.ref.delete()
  //   );
  //   await Promise.all(deletePromises);
  // }

  //TODO: TO be refactored
  // private async deleteParkingSlotsByParkingLotId(
  //   parkingLotId: string
  // ): Promise<void> {
  //   // Logic to delete parking slots associated with the parking lot
  //   // This function should handle the deletion of parking slots when a parking lot is deleted

  //   // Get a reference to the parking slots collection
  //   const parkingSlotsCollection = admin.firestore().collection("parkingSlots");

  //   // Query the parking slots collection for parking slots associated with the parking lot
  //   const parkingSlotsQuery = parkingSlotsCollection.where(
  //     "lotId",
  //     "==",
  //     parkingLotId
  //   );

  //   // Get the parking slots associated with the parking lot
  //   const parkingSlotsSnapshot = await parkingSlotsQuery.get();

  //   // Create a promise for each delete operation
  //   const deletePromises = parkingSlotsSnapshot.docs.map((doc) =>
  //     doc.ref.delete()
  //   );

  //   // Wait for all delete operations to complete
  //   await Promise.all(deletePromises);
  // }

  //TODO: TO be refactored
  // async createParkingLotWithSlotsAndRates(
  //   parkingLot: ParkingLot,
  //   ownerID: string,
  //   parkingSlots: ParkingSlot[],
  //   parkingRates: ParkingLotRate[]
  // ): Promise<ParkingLot> {
  //   const db = admin.firestore();

  //   // Generate a new document reference for the parking lot so we can use its ID for slots and rates
  //   const parkingLotRef = this.collection().doc();

  //   // Start a transaction
  //   await db.runTransaction(async (transaction) => {
  //     // Prepare the parking lot data
  //     const parkingLotData = ParkingLotFirestoreModel.fromEntity(
  //       parkingLot
  //     ).toDocumentData(
  //       parkingLotRef.id,
  //       firestore.FieldValue.serverTimestamp()
  //     );

  //     // Set the parking lot document within the transaction
  //     transaction.set(parkingLotRef, parkingLotData);

  //     // Prepare and set parking slots data
  //     parkingSlots.forEach((slot) => {
  //       const slotRef = db.collection("parkingSlots").doc(); // Generate a new doc for each slot
  //       const slotData = ParkingSlotFirestoreModel.fromEntity({
  //         ...slot,
  //         lotId: parkingLotRef.id,
  //       }).toDocumentData(slotRef.id, firestore.FieldValue.serverTimestamp());
  //       transaction.set(slotRef, slotData);
  //     });

  //     // Prepare and set parking rates data
  //     parkingRates.forEach((rate) => {
  //       const rateRef = db.collection("parkingLotRates").doc(); // Generate a new doc for each rate
  //       const rateData = ParkingLotRateFirestoreModel.fromEntity({
  //         ...rate,
  //         lotId: parkingLotRef.id,
  //       }).toDocumentData(rateRef.id, firestore.FieldValue.serverTimestamp());
  //       transaction.set(rateRef, rateData);
  //     });
  //   });

  //   // Since the transaction does not return the created object, manually fetch or construct the parking lot object to return
  //   // Fetching the created parking lot from Firestore immediately after the transaction
  //   const createdParkingLotSnapshot = await parkingLotRef.get();
  //   if (!createdParkingLotSnapshot.exists) {
  //     throw new Error("Failed to create parking lot.");
  //   }
  //   return ParkingLotFirestoreModel.fromDocumentData(
  //     createdParkingLotSnapshot.data()
  //   );
  // }

  async geosearchParkingLots(
    lat: number,
    lon: number,
    radius: number
  ): Promise<ParkingLot[]> {
    console.log("lat", lat);
    console.log("lon", lon);
    console.log("radius", radius);

    console.log("geocollection", this.geocollection);

    // Perform the geosearch query
    const query = this.geocollection.near({
      center: new firestore.GeoPoint(lat, lon),
      radius: radius,
    });

    // Get the results of the query
    const value = await query.get();
    console.log("value", value);

    // Process the results to fetch each parking lot's full details
    const parkingLotsFromSearch = await Promise.all(
      value.docs.map(async (geoDoc) => {
        // The geosearch only gives us the lotId, so we need to retrieve the full parking lot details
        // Assuming each geodoc data contains ownerId and lotId
        const ownerId = geoDoc.data().ownerId;
        const lotId = geoDoc.data().lotId;

        if (!ownerId || !lotId) {
          throw new Error("Owner ID or Lot ID is missing in geosearch result.");
        }

        // Retrieve the full parking lot details from the subcollection
        const parkingLotRef = this.parkingLotDoc(ownerId, lotId);
        const parkingLotSnapshot = await parkingLotRef.get();

        if (!parkingLotSnapshot.exists) {
          throw new Error(`Parking lot not found: ${lotId}`);
        }

        return ParkingLotFirestoreModel.fromDocumentData(
          parkingLotSnapshot.data()
        );
      })
    );

    return parkingLotsFromSearch;
  }
}

// Export a singleton instance in the global namespace
// This ensures that there's only one instance of ProductsService throughout the application,
// which allows for consistent state and behavior across different parts of the application.
export const parkingLotService = new ParkingLotService();
