import { Vehicle } from "../../../Vehicle";
import { validateRegistrationNumber } from "./validators";

/**
 * A class representing a vehicle client model.
 *
 */
export class VehicleClientModel extends Vehicle {
  static kVehicleId = "vehicleId";
  static kRegistrationNumber = "registrationNumber";
  static kNickName = "nickName";
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
      "", // nickName
      false, // defaultVehicle
      "", // userId
      new Date() // createdAt
    );
  }

  private static _validate(body: any) {
    validateRegistrationNumber(body[this.kRegistrationNumber]);
  }

  static validate(body: any, driverId: string): VehicleClientModel {
    this._validate(body);
    return new VehicleClientModel(
      null,
      body[this.kRegistrationNumber],
      body[this.kNickName],
      body[this.kDefaultVehicle],
      body[this.kUserId],
      null
    );
  }

  toBodyFullVehicle(): any {
    return {
      ...this.toBodyPublicVehicle(),
      [VehicleClientModel.kCreatedAt]: this.createdAt,
      [VehicleClientModel.kUserId]: this.userId,
    };
  }

  toBodyPublicVehicle() {
    return {
      [VehicleClientModel.kVehicleId]: this.vehicleId,
      [VehicleClientModel.kRegistrationNumber]: this.registrationNumber,
      [VehicleClientModel.kNickName]: this.nickName,
      [VehicleClientModel.kDefaultVehicle]: this.defaultVehicle,
    };
  }
}
