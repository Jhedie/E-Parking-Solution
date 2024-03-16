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
    if (body[ParkingLotRatesClientModel.kNightRate] !== undefined) {
      res.nightRate = body[ParkingLotRatesClientModel.kNightRate];
    }
    if (body[ParkingLotRatesClientModel.kMinimum] !== undefined) {
      res.minimum = body[ParkingLotRatesClientModel.kMinimum];
    }
    if (body[ParkingLotRatesClientModel.kMaximum] !== undefined) {
      res.maximum = body[ParkingLotRatesClientModel.kMaximum];
    }
    if (body[ParkingLotRatesClientModel.kDiscount] !== undefined) {
      res.discount = body[ParkingLotRatesClientModel.kDiscount];
    }
    if (body[ParkingLotRatesClientModel.kDynamicPricing] !== undefined) {
      res.dynamicPricing = body[ParkingLotRatesClientModel.kDynamicPricing];
    }

    return res;
  }
}
