import { Rate } from "./ParkingLotRate";

export type ParkingStatus =
  | "active"
  | "completed"
  | "cancelled"
  | "expired"
  | "pending"
  | "no show"
  | null;

export type PaymentStatus = "completed" | "failed" | "refunded";

export type BookingConfirmationDetails = {
  userId: string;
  slotId: string;
  lotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  usedRates: Rate[];
  totalAmount: number;
  parkingStatus?: ParkingStatus;
  paymentStatus?: PaymentStatus;
  modifiedAt?: Date;
  createdAt?: Date;
};

export type successfulBookingConfirmation = {
  reservationId: string;
  userId: string;
  slotId: string;
  lotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  usedRates: Rate[];
  totalAmount: number;
  parkingStatus?: ParkingStatus;
  paymentStatus?: PaymentStatus;
  modifiedAt?: Date;
  createdAt?: Date;
};
