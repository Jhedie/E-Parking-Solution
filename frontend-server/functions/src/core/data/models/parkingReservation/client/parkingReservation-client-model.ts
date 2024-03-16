import { ParkingReservation } from "../../../parkingReservation";

export class ParkingReservationClientModel extends ParkingReservation {
  static kReservationId = "reservationId";
  static kUserId = "userId";
  static kSlotId = "slotId";
  static kStartTime = "startTime";
  static kEndTime = "endTime";
  static kRateNumber = "rateNumber";
  static kRateType = "rateType";
  static kPrice = "price";
  static kTotalAmount = "totalAmount";
  static kStatus = "status";
  static kCreatedAt = "createdAt";

  static fromEntity(entity: ParkingReservation): ParkingReservationClientModel {
    return Object.assign(ParkingReservationClientModel.empty(), entity);
  }

  static empty(): ParkingReservationClientModel {
    return new ParkingReservationClientModel(
      "", // reservationId
      "", // userId
      "", // slotId
      null, // startTime
      null, // endTime
      0, // rateNumber
      null, // rateType
      0, // price
      0, // totalAmount
      null,
      new Date() // createdAt
    );
  }

  //TODO: Add necessary validations if needed
  private static _validate(body: any) {}

  static validate(body: any, userId: string): ParkingReservationClientModel {
    this._validate(body);

    return new ParkingReservationClientModel(
      null, // reservationId is null as it will be generated by Firestore
      userId, // userId
      body[this.kSlotId],
      new Date(body[this.kStartTime]),
      new Date(body[this.kEndTime]),
      body[this.kRateNumber],
      body[this.kRateType],
      body[this.kPrice],
      body[this.kTotalAmount],
      body[this.kStatus],
      null // createdAt is null as it will be generated by Firestore
    );
  }

  toBodyPublicReservation(): any {
    return {
      reservationId: this.reservationId,
      slotId: this.slotId,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      rateNumber: this.rateNumber,
      rateType: this.rateType,
      price: this.price,
      totalAmount: this.totalAmount,
      status: this.status,
    };
  }

  toBodyFullReservation(): any {
    return {
      ...this.toBodyPublicReservation(),
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
