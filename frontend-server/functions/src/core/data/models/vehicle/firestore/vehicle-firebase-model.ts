import { firestore } from "firebase-admin";
import { Vehicle } from "../../../vehicle";
import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;
class VehicleFirestoreModel extends Vehicle {
  static kVehicleId = "vehicleId";
  static kRegistrationNumber = "registrationNumber";
  static kImage = "image";
  static kDefaultVehicle = "defaultVehicle";
  static kUserId = "userId";
  static kCreatedAt = "createdAt";

  /**Creates a vehicleFirestoreModel instance from a Vehicle entity.
   * @param {Vehicle} vehicle - The Vehicle entity from which to create the VehicleFirestoreModel instance.
   * @returns {VehicleFirestoreModel} - The created VehicleFirestoreModel instance.
   */
  static fromEntity(vehicle?: Vehicle): VehicleFirestoreModel {
    if (vehicle == null) return null;

    return Object.assign(VehicleFirestoreModel.empty(), vehicle);
  }

  /**
   * Creates an empty VehicleFirestoreModel instance.
   * @returns {VehicleFirestoreModel} - The created empty VehicleFirestoreModel instance.
   */
  static empty(): VehicleFirestoreModel {
    return new VehicleFirestoreModel("", "", "", false, "", new Date());
  }

  toDocumentData(vehicleId?: string, createdAt?: Timestamp | FieldValue) {
    return {
      [VehicleFirestoreModel.kVehicleId]: vehicleId ?? this.vehicleId,
      [VehicleFirestoreModel.kRegistrationNumber]: this.registrationNumber,
      [VehicleFirestoreModel.kImage]: this.image,
      [VehicleFirestoreModel.kDefaultVehicle]: this.defaultVehicle,
      [VehicleFirestoreModel.kUserId]: this.userId,
    };
  }

  static fromDocumentData(data: DocumentData) {
    return new VehicleFirestoreModel(
      data[VehicleFirestoreModel.kVehicleId],
      data[VehicleFirestoreModel.kRegistrationNumber],
      data[VehicleFirestoreModel.kImage],
      data[VehicleFirestoreModel.kDefaultVehicle],
      data[VehicleFirestoreModel.kUserId],
      (data[VehicleFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}

export { VehicleFirestoreModel };
