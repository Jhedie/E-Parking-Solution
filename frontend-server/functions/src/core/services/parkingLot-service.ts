import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/parkingLot-firestore-model";
import { PartialParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/partial-parkingLot-firestore-model";
import { ParkingLot } from "../data/parkingLot";
import FieldValue = firestore.FieldValue;

class ParkingLotService {
  private collection() {
    return admin.firestore().collection("parkingLots");
  }

  /**
   * Returns a DocumentReference for a specific parking lot or a new parking lot.
   *
   * @param {string} [LotId] - The ID of the parking lot. If not provided, a DocumentReference for a new parking lot is returned.
   * @returns {DocumentReference} A DocumentReference that can be used to read or write data to the specified parking lot document.
   */
  private doc(LotId?: string) {
    // If no LotId is provided, return a DocumentReference for a new parking lot
    if (!LotId) return this.collection().doc();

    // If a LotId is provided, return a DocumentReference for the specified parking lot
    return this.collection().doc(LotId);
  }

  /**
   * Creates a new parking lot in the firestore database.
   *
   * @param parkingLot
   * @returns A promise that resolves to the created parkingLot entity.
   */
  async createParkingLot(parkingLot: ParkingLot): Promise<ParkingLot> {
    // Get a refernce to a new document with an auto-generated ID in the firebase collection
    const parkingLotRef = this.doc();
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
  async getParkingLots(): Promise<ParkingLot[]> {
    // Fetch all documents from the collection

    const snapshot = await this.collection().get();
    // Convert each document to a ParkingLot object and return the array
    return snapshot.docs.map((doc) =>
      ParkingLotFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async getParkingLotById(productId: string): Promise<ParkingLot | null> {
    const parkingLotResult = await this.doc(productId).get();
    if (!parkingLotResult.exists) {
      return null;
    }
    return ParkingLotFirestoreModel.fromDocumentData(parkingLotResult.data());
  }

  async updateParkingLotById(
    parkingLotId: string,
    partialParkingLot: Partial<Record<keyof ParkingLot, any>>
  ): Promise<void> {
    //convert the partial parking lot data to a format suitable for updating the document
    const documentData =
      PartialParkingLotFirestoreModel.fromPartialEntity(
        partialParkingLot
      ).toDocumentData();

    // Update the parking lot document with the new data
    await this.doc(parkingLotId).update(documentData);
  }

  async deleteParkingLotById(parkingLotId: string): Promise<void> {
    // Delete the parking slots associated with the parking lot
    await this.deleteParkingSlotsByParkingLotId(parkingLotId);

    //Delete the parking lot rates associated with the parking lot
    await this.deleteParkingLotRatesByParkingLotId(parkingLotId);

    // Delete the parking lot document
    await this.doc(parkingLotId).delete();
  }
  private async deleteParkingLotRatesByParkingLotId(
    parkingLotId: string
  ): Promise<void> {
    // Get a reference to the parking lot rates collection
    const parkingLotRatesCollection = admin
      .firestore()
      .collection("parkingLotRates");

    // Query the parking lot rates collection for rates associated with the parking lot
    const parkingLotRatesQuery = parkingLotRatesCollection.where(
      "lotId",
      "==",
      parkingLotId
    );

    // Get the parking lot rates associated with the parking lot
    const parkingLotRatesSnapshot = await parkingLotRatesQuery.get();

    // Delete the parking lot rates
    const deletePromises = parkingLotRatesSnapshot.docs.map((doc) =>
      doc.ref.delete()
    );
    await Promise.all(deletePromises);
  }
  private async deleteParkingSlotsByParkingLotId(
    parkingLotId: string
  ): Promise<void> {
    // Logic to delete parking slots associated with the parking lot
    // This function should handle the deletion of parking slots when a parking lot is deleted

    // Get a reference to the parking slots collection
    const parkingSlotsCollection = admin.firestore().collection("parkingSlots");

    // Query the parking slots collection for parking slots associated with the parking lot
    const parkingSlotsQuery = parkingSlotsCollection.where(
      "lotId",
      "==",
      parkingLotId
    );

    // Get the parking slots associated with the parking lot
    const parkingSlotsSnapshot = await parkingSlotsQuery.get();

    // Create a promise for each delete operation
    const deletePromises = parkingSlotsSnapshot.docs.map((doc) =>
      doc.ref.delete()
    );

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);
  }
}

// Export a singleton instance in the global namespace
// This ensures that there's only one instance of ProductsService throughout the application,
// which allows for consistent state and behavior across different parts of the application.
export const parkingLotService = new ParkingLotService();
