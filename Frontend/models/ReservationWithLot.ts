import { successfulBookingConfirmation } from "./BookingConfirmationDetails";
import { ParkingLot } from "./ParkingLot";
import { ParkingSlot } from "./ParkingSlot";
import { Vehicle } from "./Vehicle";

export interface ReservationWithLot
  extends Omit<successfulBookingConfirmation, "startTime" | "endTime"> {
  startTime: string;
  endTime: string;
  parkingLotDetails: ParkingLot;
  slotDetails: ParkingSlot;
  vehicleDetails: Vehicle;
}
