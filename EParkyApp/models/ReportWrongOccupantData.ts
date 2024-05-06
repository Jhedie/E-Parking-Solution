import { ReservationWithLot } from "./ReservationWithLot";

export interface ReportWrongOccupantData {
  registrationNumber: string;

  reservation: ReservationWithLot;
}
