import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/parkingLot-firebase-model";
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
}

// Export a singleton instance in the global namespace
// This ensures that there's only one instance of ProductsService throughout the application,
// which allows for consistent state and behavior across different parts of the application.
export const parkingLotService = new ParkingLotService();
