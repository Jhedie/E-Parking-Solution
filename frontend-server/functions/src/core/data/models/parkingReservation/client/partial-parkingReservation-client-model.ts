import { ParkingReservation } from "../../../parkingReservation";
import { ParkingReservationClientModel } from "./parkingReservation-client-model";

export class PartialParkingReservationClientModel {
  //TODO: Add necessary validations if needed.
  private static _validate(body: any) {}

  static validate(body: any): Partial<Record<keyof ParkingReservation, any>> {
    this._validate(body);

    const res: Partial<Record<keyof ParkingReservation, any>> = {};

    if (body[ParkingReservationClientModel.kVehicleId] !== undefined) {
      res.vehicleId = body[ParkingReservationClientModel.kVehicleId];
    }
    if (body[ParkingReservationClientModel.kSlotId] !== undefined) {
      res.slotId = body[ParkingReservationClientModel.kSlotId];
    }
    if (body[ParkingReservationClientModel.kStartTime] !== undefined) {
      res.startTime = new Date(body[ParkingReservationClientModel.kStartTime]);
    }
    if (body[ParkingReservationClientModel.kEndTime] !== undefined) {
      res.endTime = new Date(body[ParkingReservationClientModel.kEndTime]);
    }
    if (body[ParkingReservationClientModel.kUsedRates] !== undefined) {
      res.usedRates = body[ParkingReservationClientModel.kUsedRates];
    }
    if (body[ParkingReservationClientModel.kTotalAmount] !== undefined) {
      res.totalAmount = body[ParkingReservationClientModel.kTotalAmount];
    }
    if (body[ParkingReservationClientModel.kParkingStatus] !== undefined) {
      res.parkingStatus = body[ParkingReservationClientModel.kParkingStatus];
    }
    if (body[ParkingReservationClientModel.kPaymentStatus] !== undefined) {
      res.paymentStatus = body[ParkingReservationClientModel.kPaymentStatus];
    }
    if (body[ParkingReservationClientModel.kCheckedIn] !== undefined) {
      res.checkedIn = body[ParkingReservationClientModel.kCheckedIn];
    }

    if (body[ParkingReservationClientModel.kModifiedAt] !== undefined) {
      res.modifiedAt = new Date(
        body[ParkingReservationClientModel.kModifiedAt]
      );
    }

    return res;
  }
}
