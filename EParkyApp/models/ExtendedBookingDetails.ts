import { Rate } from "./ParkingLotRate";

export type ExtendedBookingDetails = {
  extensionStartTime: string;
  extensionEndTime: string;
  totalAmount: number;
  rate: Rate;
};
