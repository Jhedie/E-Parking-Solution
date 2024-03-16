import { ParkingReservation } from "../../../parkingReservation";
import { ParkingReservationClientModel } from "./parkingReservation-client-model";

export class PartialParkingReservationClientModel {
  //TODO: Add necessary validations if needed.
  private static _validate(body: any) {}

  static validate(body: any): Partial<Record<keyof ParkingReservation, any>> {
    this._validate(body);

    const res: Partial<Record<keyof ParkingReservation, any>> = {};

    if (body[ParkingReservationClientModel.kSlotId] !== undefined) {
      res.slotId = body[ParkingReservationClientModel.kSlotId];
    }
    if (body[ParkingReservationClientModel.kStartTime] !== undefined) {
      res.startTime = new Date(body[ParkingReservationClientModel.kStartTime]);
    }
    if (body[ParkingReservationClientModel.kEndTime] !== undefined) {
      res.endTime = new Date(body[ParkingReservationClientModel.kEndTime]);
    }
    if (body[ParkingReservationClientModel.kRateNumber] !== undefined) {
      res.rateNumber = body[ParkingReservationClientModel.kRateNumber];
    }
    if (body[ParkingReservationClientModel.kRateType] !== undefined) {
      res.rateType = body[ParkingReservationClientModel.kRateType];
    }
    if (body[ParkingReservationClientModel.kPrice] !== undefined) {
      res.price = body[ParkingReservationClientModel.kPrice];
    }
    if (body[ParkingReservationClientModel.kTotalAmount] !== undefined) {
      res.totalAmount = body[ParkingReservationClientModel.kTotalAmount];
    }
    if (body[ParkingReservationClientModel.kStatus] !== undefined) {
      res.status = body[ParkingReservationClientModel.kStatus];
    }

    return res;
  }
}
