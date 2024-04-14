// import * as admin from "firebase-admin";
// import { firestore } from "firebase-admin";
// import { Vehicle } from "../data/Vehicle";
// import { PartialVehicleFirebaseModel } from "../data/models/vehicle/firestore/partial-vehicle-firestore-model";
// import { VehicleFirestoreModel } from "../data/models/vehicle/firestore/vehicle-firestore-model";
// import FieldValue = firestore.FieldValue;

// class VehicleService {
//   private collection() {
//     return admin.firestore().collection("vehicles");
//   }

//   private doc(vehicleId?: string) {
//     if (!vehicleId) return this.collection().doc();
//     return this.collection().doc(vehicleId);
//   }

//   private userDoc(userId: string) {
//     return admin.firestore().collection("users").doc(userId);
//   }

//   private vehiclesCollection(userId: string) {
//     return this.userDoc(userId).collection("vehicles");
//   }

//   private vehicleDoc(userId: string, vehicleId: string) {
//     return this.vehiclesCollection(userId).doc(vehicleId);
//   }

//   async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
//     return await admin.firestore().runTransaction(async (transaction) => {
//       // Query for any existing default vehicle for the user
//       const defaultVehicleQuery = this.collection()
//         .where(VehicleFirestoreModel.kUserId, "==", vehicle.userId)
//         .where(VehicleFirestoreModel.kDefaultVehicle, "==", true);

//       // Execute the query within the transaction
//       const querySnapshot = await transaction.get(defaultVehicleQuery);

//       // Create the new vehicle
//       const vehicleRef = this.doc(); // Creates a new document reference for the new vehicle
//       const DocumentData = VehicleFirestoreModel.fromEntity(
//         vehicle
//       ).toDocumentData(vehicleRef.id, FieldValue.serverTimestamp());

//       // If there is an existing default vehicle, set its defaultVehicle to false
//       querySnapshot.forEach((doc) => {
//         transaction.update(doc.ref, { defaultVehicle: false });
//       });

//       // Set the new vehicle document with the provided data
//       transaction.set(vehicleRef, DocumentData);

//       // Return the VehicleFirestoreModel from the new vehicle document
//       return VehicleFirestoreModel.fromEntity(vehicle);
//     });
//   }

//   async getVehicleById(vehicleId: string) {
//     const vehicleRes = await this.doc(vehicleId).get();
//     if (!vehicleRes.exists) {
//       return null;
//     }
//     return VehicleFirestoreModel.fromDocumentData(vehicleRes.data());
//   }

//   async getVehicles() {
//     const snapshot = await this.collection().get();
//     return snapshot.docs.map((doc) =>
//       VehicleFirestoreModel.fromDocumentData(doc.data())
//     );
//   }

//   async getVehiclesByUserId(userId: string): Promise<Vehicle[]> {
//     const snapshot = await this.collection()
//       .where(VehicleFirestoreModel.kUserId, "==", userId)
//       .get();
//     return snapshot.docs.map((doc) =>
//       VehicleFirestoreModel.fromDocumentData(doc.data())
//     );
//   }

//   // This method is designed to ensure that only one vehicle can be the default for a user at a time.
//   // If a vehicle is being set as the default, it first checks if there are any other vehicles set as the default and updates them.
//   // If a vehicle is being unset as the default, it sets the first vehicle created by the user as the default.
//   async updateVehicleById(
//     vehicleId: string,
//     partialVehicle: Partial<Record<keyof Vehicle, any>>
//   ): Promise<void> {
//     // Convert the partial vehicle data to a format suitable for updating the document
//     const db = admin.firestore();

//     await db.runTransaction(async (transaction) => {
//       const vehicleRef = this.doc(vehicleId);
//       const vehicleDoc = await transaction.get(vehicleRef);

//       // If updating vehicle to be the default, ensure no other vehicles are set as default
//       if (partialVehicle.defaultVehicle === true) {
//         const defaultVehicleQuery = this.collection()
//           .where(VehicleFirestoreModel.kUserId, "==", vehicleDoc.data().userId)
//           .where(VehicleFirestoreModel.kDefaultVehicle, "==", true);

//         const querySnapshot = await transaction.get(defaultVehicleQuery);
//         querySnapshot.forEach((doc) => {
//           if (doc.id !== vehicleId) {
//             // Avoid updating the current vehicle being processed
//             transaction.update(doc.ref, { defaultVehicle: false });
//           }
//         });
//       }
//       // if the defaultvehicle is set to false, then set the first created vehicle as default
//       if (partialVehicle.defaultVehicle === false) {
//         const defaultVehicleQuery = this.collection()
//           .where(VehicleFirestoreModel.kUserId, "==", vehicleDoc.data().userId)
//           .orderBy(VehicleFirestoreModel.kCreatedAt, "asc")
//           .limit(1);

//         const querySnapshot = await transaction.get(defaultVehicleQuery);
//         querySnapshot.forEach((doc) => {
//           if (doc.id !== vehicleId) {
//             // Avoid updating the current vehicle being processed
//             transaction.update(doc.ref, { defaultVehicle: true });
//           }
//         });
//       }

//       // Then, update the vehicle document with the new data
//       const documentData =
//         PartialVehicleFirebaseModel.fromPartialEntity(
//           partialVehicle
//         ).toDocumentData();
//       transaction.update(vehicleRef, documentData);
//     });
//   }

//   async deleteVehicleById(vehicleId: string): Promise<void> {
//     await this.doc(vehicleId).delete();
//   }
// }

// export const vehicleService: VehicleService = new VehicleService();
