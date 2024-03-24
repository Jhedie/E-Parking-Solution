import { Vehicle } from "../../../Vehicle";
import { VehicleClientModel } from "./vehicle-client-model";

export class PartialVehicleClientModel {
  private static _validate(body: any) {}

  static validate(body: any): Partial<Record<keyof Vehicle, any>> {
    this._validate(body);
    const res: Partial<Record<keyof Vehicle, any>> = {};

    if (body[VehicleClientModel.kNickName])
      res.nickName = body[VehicleClientModel.kNickName];
    if (body[VehicleClientModel.kDefaultVehicle])
      res.defaultVehicle = body[VehicleClientModel.kDefaultVehicle];
    return res;
  }
}
