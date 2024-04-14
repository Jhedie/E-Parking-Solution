import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { Vehicle } from "../data/Vehicle";
import { PartialVehicleFirebaseModel } from "../data/models/vehicle/firestore/partial-vehicle-firestore-model";
import { VehicleFirestoreModel } from "../data/models/vehicle/firestore/vehicle-firestore-model";
import FieldValue = firestore.FieldValue;

class VehicleService {
  private userDoc(userId: string) {
    if (!userId) {
      throw new Error("A valid userId must be provided.");
    }
    return admin.firestore().collection("users").doc(userId);
  }

  private vehiclesCollection(userId: string) {
    return this.userDoc(userId).collection("vehicles");
  }

  private vehicleDoc(userId: string, vehicleId: string) {
    if (!vehicleId) {
      throw new Error("A valid vehicleId must be provided.");
    }
    return this.vehiclesCollection(userId).doc(vehicleId);
  }

  async createVehicle(vehicle: Vehicle, userId: string): Promise<Vehicle> {
    console.log("In the service for creation");

    console.log("userId", userId);
    return await admin.firestore().runTransaction(async (transaction) => {
      // Query for any existing default vehicle for the user
      const defaultVehicleQuery = this.vehiclesCollection(userId).where(
        VehicleFirestoreModel.kDefaultVehicle,
        "==",
        true
      );

      // Execute the query within the transaction
      const querySnapshot = await transaction.get(defaultVehicleQuery);

      // Create the new vehicle
      const vehicleRef = this.vehiclesCollection(userId).doc();
      // Creates a new document reference for the new vehicle
      const DocumentData = VehicleFirestoreModel.fromEntity(
        vehicle
      ).toDocumentData(vehicleRef.id, FieldValue.serverTimestamp());

      // If there is an existing default vehicle, set its defaultVehicle to false
      querySnapshot.forEach((doc) => {
        transaction.update(doc.ref, { defaultVehicle: false });
      });

      // Set the new vehicle document with the provided data
      transaction.set(vehicleRef, DocumentData);

      // Return the VehicleFirestoreModel from the new vehicle document
      return VehicleFirestoreModel.fromEntity(vehicle);
    });
  }

  // Retrieves a specific vehicle by its ID
  async getVehicleById(userId: string, vehicleId: string) {
    const vehicleRes = await this.vehicleDoc(userId, vehicleId).get();
    if (!vehicleRes.exists) {
      return null;
    }
    return VehicleFirestoreModel.fromDocumentData(vehicleRes.data());
  }

  async getVehicles(userId: string) {
    const snapshot = await this.vehiclesCollection(userId).get();
    return snapshot.docs.map((doc) =>
      VehicleFirestoreModel.fromDocumentData(doc.data())
    );
  }

  // Retrieves all vehicles for a specific user
  async getVehiclesByUserId(userId: string): Promise<Vehicle[]> {
    const snapshot = await this.vehiclesCollection(userId).get();
    return snapshot.docs.map((doc) =>
      VehicleFirestoreModel.fromDocumentData(doc.data())
    );
  }

  // This method is designed to ensure that only one vehicle can be the default for a user at a time.
  // If a vehicle is being set as the default, it first checks if there are any other vehicles set as the default and updates them.
  // If a vehicle is being unset as the default, it sets the first vehicle created by the user as the default.
  async updateVehicleById(
    userId: string,
    vehicleId: string,
    partialVehicle: Partial<Record<keyof Vehicle, any>>
  ): Promise<void> {
    const db = admin.firestore();
    await db.runTransaction(async (transaction) => {
      const vehicleRef = this.vehicleDoc(userId, vehicleId);

      if (partialVehicle.defaultVehicle === true) {
        const defaultVehicleQuery = this.vehiclesCollection(userId).where(
          VehicleFirestoreModel.kDefaultVehicle,
          "==",
          true
        );

        const querySnapshot = await transaction.get(defaultVehicleQuery);
        querySnapshot.forEach((doc) => {
          if (doc.id !== vehicleId) {
            transaction.update(doc.ref, { defaultVehicle: false });
          }
        });
      }

      if (partialVehicle.defaultVehicle === false) {
        const defaultVehicleQuery = this.vehiclesCollection(userId)
          .orderBy(VehicleFirestoreModel.kCreatedAt, "asc")
          .limit(1);

        const querySnapshot = await transaction.get(defaultVehicleQuery);
        querySnapshot.forEach((doc) => {
          if (doc.id !== vehicleId) {
            transaction.update(doc.ref, { defaultVehicle: true });
          }
        });
      }

      const documentData =
        PartialVehicleFirebaseModel.fromPartialEntity(
          partialVehicle
        ).toDocumentData();
      transaction.update(vehicleRef, documentData);
    });
  }

  async deleteVehicleById(userId: string, vehicleId: string): Promise<void> {
    await this.vehicleDoc(userId, vehicleId).delete();
  }
}

export const vehicleService: VehicleService = new VehicleService();
