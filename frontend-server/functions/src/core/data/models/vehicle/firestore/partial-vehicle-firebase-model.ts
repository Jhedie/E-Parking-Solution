import { Vehicle } from "../../../Vehicle";
import { VehicleFirestoreModel } from "./vehicle-firebase-model";

export class PartialVehicleFirebaseModel {
  static fromPartialEntity(
    partialVehicle: Partial<Record<keyof Vehicle, any>>
  ) {
    return {
      ...partialVehicle,
      toDocumentData(): Partial<Record<string, any>> {
        const res: Partial<Record<string, any>> = {};
        if (partialVehicle.vehicleId)
          res[VehicleFirestoreModel.kVehicleId] = partialVehicle.vehicleId;
        if (partialVehicle.registrationNumber)
          res[VehicleFirestoreModel.kRegistrationNumber] =
            partialVehicle.registrationNumber;
        if (partialVehicle.nickName)
          res[VehicleFirestoreModel.kNickName] = partialVehicle.nickName;
        if (partialVehicle.defaultVehicle)
          res[VehicleFirestoreModel.kDefaultVehicle] =
            partialVehicle.defaultVehicle;
        if (partialVehicle.userId)
          res[VehicleFirestoreModel.kUserId] = partialVehicle.userId;
        return res;
      },
    };
  }
}
