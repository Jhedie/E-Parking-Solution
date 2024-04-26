import { ParkingLotRate } from "./parkingLotRates";

export type ParkingStatus =
  | "active"
  | "completed"
  | "cancelled"
  | "expired"
  | "pending"
  | "no show"
  | null;

export type PaymentStatus = "completed" | "failed" | "refunded";

class ParkingReservation {
  public readonly reservationId: string;
  public readonly userId: string;
  public readonly slotId: string;
  public readonly lotId: string;
  public readonly vehicleId: string;
  public readonly startTime: Date;
  public readonly endTime: Date;
  public readonly usedRates: ParkingLotRate[];
  public readonly totalAmount: number;
  public readonly parkingStatus: ParkingStatus;
  public readonly paymentStatus: PaymentStatus;
  public readonly checkedIn: boolean;
  public readonly stripeCustomerId: string;
  public readonly modifiedAt: Date;
  public readonly createdAt: Date;

  constructor(
    reservationId: string,
    userId: string,
    slotId: string,
    lotId: string,
    vehicleId: string,
    startTime: Date,
    endTime: Date,
    usedRates: ParkingLotRate[],
    totalAmount: number,
    parkingStatus: ParkingStatus,
    paymentStatus: PaymentStatus,
    checkedIn: boolean,
    stripeCustomerId: string,
    modifiedAt: Date,
    createdAt: Date
  ) {
    this.reservationId = reservationId;
    this.userId = userId;
    this.slotId = slotId;
    this.lotId = lotId;
    this.vehicleId = vehicleId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.usedRates = usedRates;
    this.totalAmount = totalAmount;
    this.parkingStatus = parkingStatus;
    this.paymentStatus = paymentStatus;
    this.checkedIn = checkedIn;
    this.stripeCustomerId = stripeCustomerId;
    this.modifiedAt = modifiedAt;
    this.createdAt = createdAt;
  }

  static empty(): ParkingReservation {
    return new ParkingReservation(
      "", // reservationId
      "", // userId
      "", // slotId
      "", // lotId
      "", // vehicleId
      null, // startTime
      null, // endTime
      [], // usedRates
      0, // totalAmount
      null, // parkingStatus
      null, // paymentStatus
      false, // checkedIn
      "", // stripeCustomerId
      new Date(), // modifiedAt
      new Date() // createdAt
    );
  }
}

export { ParkingReservation };
