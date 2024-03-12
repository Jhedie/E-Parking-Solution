import { Vehicle } from "../../../vehicle";
import { validateRegistrationNumber, validateVehicleId } from "./validators";

/**
 * A class representing a vehicle client model.
 *
 */
export class VehicleClientModel extends Vehicle {
  static kVehicleId = "vehicleId";
  static kRegistrationNumber = "registrationNumber";
  static kImage = "image";
  static kDefaultVehicle = "defaultVehicle";
  static kUserId = "userId";
  static kCreatedAt = "createdAt";

  static fromEntity(entity: Vehicle): VehicleClientModel {
    return Object.assign(VehicleClientModel.empty(), entity);
  }

  static empty(): VehicleClientModel {
    return new VehicleClientModel(
      "", // vehicleId
      "", // registrationNumber
      "", // image
      false, // defaultVehicle
      "", // userId
      new Date() // createdAt
    );
  }

  private static _validate(body: any) {
    validateVehicleId(body[this.kVehicleId]);
    validateRegistrationNumber(body[this.kRegistrationNumber]);
  }

  static validate(body: any, driverId: string): VehicleClientModel {
    this._validate(body);
    return new VehicleClientModel(
      null,
      body[this.kRegistrationNumber],
      body[this.kImage],
      body[this.kDefaultVehicle],
      driverId,
      null
    );
  }

  toBodyFullVehicle(): any {
    return {
      ...this.toBodyPublicProduct(),
      [VehicleClientModel.kUserId]: this.userId,
      [VehicleClientModel.kCreatedAt]: this.createdAt,
    };
  }

  toBodyPublicProduct() {
    return {
      [VehicleClientModel.kVehicleId]: this.vehicleId,
      [VehicleClientModel.kRegistrationNumber]: this.registrationNumber,
      [VehicleClientModel.kImage]: this.image,
      [VehicleClientModel.kDefaultVehicle]: this.defaultVehicle,
    };
  }
}
