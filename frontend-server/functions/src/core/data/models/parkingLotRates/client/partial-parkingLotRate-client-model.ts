import { ParkingLotRate } from "../../../parkingLotRates";
import { ParkingLotRatesClientModel } from "./parkingLotRate-client-model";
import { validateTimeRange } from "./validators";

export class PartialParkingLotRatesClientModel {
  private static _validate(body: any) {
    validateTimeRange(body);
  }

  static validate(body: any): Partial<Record<keyof ParkingLotRate, any>> {
    this._validate(body);
    const res: Partial<Record<keyof ParkingLotRate, any>> = {};

    if (body[ParkingLotRatesClientModel.kRate] !== undefined) {
      res.rate = body[ParkingLotRatesClientModel.kRate];
    }
    if (body[ParkingLotRatesClientModel.kDuration] !== undefined) {
      res.duration = body[ParkingLotRatesClientModel.kDuration];
    }

    return res;
  }
}
