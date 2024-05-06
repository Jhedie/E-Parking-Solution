import { Rate } from "./ParkingLotRate";

export type BookingDetails = {
  startDateTime: string;
  endDateTime: string;
  totalprice: number;
  rate: Rate;
};
