import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { PartialVehicleFirebaseModel } from "../data/models/vehicle/firestore/partial-vehicle-firebase-model";
import { VehicleFirestoreModel } from "../data/models/vehicle/firestore/vehicle-firebase-model";
import { Vehicle } from "../data/vehicle";
import FieldValue = firestore.FieldValue;

class VehicleService {
  private collection() {
    return admin.firestore().collection("vehicles");
  }

  private doc(vehicleId?: string) {
    if (!vehicleId) return this.collection().doc();
    return this.collection().doc(vehicleId);
  }

  async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    const vehicleRef = this.doc();
    const DocumentData = VehicleFirestoreModel.fromEntity(
      vehicle
    ).toDocumentData(vehicleRef.id, FieldValue.serverTimestamp());

    await vehicleRef.set(DocumentData);
    return VehicleFirestoreModel.fromDocumentData(
      (await vehicleRef.get()).data()
    );
  }

  async getVehicleById(vehicleId: string) {
    const vehicleRes = await this.doc(vehicleId).get();
    if (!vehicleRes.exists) {
      return null;
    }
    return VehicleFirestoreModel.fromDocumentData(vehicleRes.data());
  }

  async getVehiclesByUserId(userId: string) {
    const snapshot = await this.collection()
      .where(VehicleFirestoreModel.kUserId, "==", userId)
      .get();
    return snapshot.docs.map((doc) =>
      VehicleFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async updateVehicleById(
    vehicleId: string,
    partialVehicle: Partial<Record<keyof Vehicle, any>>
  ): Promise<void> {
    const documentData =
      PartialVehicleFirebaseModel.fromPartialEntity(
        partialVehicle
      ).toDocumentData();
    await this.doc(vehicleId).update(documentData);
  }

  async deleteVehicleById(vehicleId: string): Promise<void> {
    await this.doc(vehicleId).delete();
  }
}

export const vehicleService: VehicleService = new VehicleService();
