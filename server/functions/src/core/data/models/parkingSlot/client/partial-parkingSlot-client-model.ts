import { ParkingSlot } from "../../../parkingSlot";
import { ParkingSlotClientModel } from "./parkingSlot-client-model";

export class PartialParkingSlotClientModel {
  private static _validate(body: any) {}

  static validate(body: any): Partial<Record<keyof ParkingSlot, any>> {
    this._validate(body);
    const res: Partial<Record<keyof ParkingSlot, any>> = {};
    if (body[ParkingSlotClientModel.kType])
      res.type = body[ParkingSlotClientModel.kType];
    if (body[ParkingSlotClientModel.kStatus])
      res.status = body[ParkingSlotClientModel.kStatus];
    return res;
  }
}
