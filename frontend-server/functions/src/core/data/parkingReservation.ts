export type RateType = "minute" | "hour" | "day" | "week" | "month" | null;

export type ParkingStatus =
  | "active"
  | "completed"
  | "cancelled"
  | "expired"
  | "pending"
  | "no show"
  | null;
class ParkingReservation {
  public readonly reservationId: string;
  public readonly userId: string;
  public readonly slotId: string;
  public readonly startTime: Date;
  public readonly endTime: Date;
  public readonly rateNumber: number;
  public readonly rateType: RateType;
  public readonly price: number;
  public readonly totalAmount: number;
  public readonly status: ParkingStatus;
  public readonly createdAt: Date;

  constructor(
    reservationId: string,
    userId: string,
    slotId: string,
    startTime: Date,
    endTime: Date,
    rateNumber: number,
    rateType: RateType,
    price: number,
    totalAmount: number,
    status: ParkingStatus,
    createdAt: Date
  ) {
    this.reservationId = reservationId;
    this.userId = userId;
    this.slotId = slotId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.rateNumber = rateNumber;
    this.rateType = rateType;
    this.price = price;
    this.totalAmount = totalAmount;
    this.status = status;
    this.createdAt = createdAt;
  }

  static empty(): ParkingReservation {
    return new ParkingReservation(
      "", // reservationId
      "", // userId
      "", // slotId
      null, // startTime
      null, // endTime
      0, // rateNumber
      null, // rateType
      0, // price
      0, // totalAmount
      null, // status
      new Date() // createdAt
    );
  }
}

export { ParkingReservation };
