import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { DbChangedRecord } from "../../core/data/db-changed-record";
import { ParkingReservationFirestoreModel } from "../../core/data/models/parkingReservation/firestore/parkingReservation-firestore-model";
import { dbChangesService } from "../../core/services/db-changes-service";
import {
  AddEventTrigger,
  EventTriggerV2Function,
  InitializeEventTriggers,
} from "../initialize-event-triggers";

export class ParkingReservationEventTriggers
  implements InitializeEventTriggers
{
  initialize(add: AddEventTrigger): void {
    add(this.onCreated);
    add(this.onDeleted);
    add(this.onUpdated);
  }

  private readonly onCreated: EventTriggerV2Function = {
    name: "onParkingReservationCreated",
    handler: onDocumentCreated(
      "parkingReservations/{reservationId}",
      async (document) => {
        const reservation = ParkingReservationFirestoreModel.fromDocumentData(
          document.data.data()
        );
        const record = new DbChangedRecord(
          "PARKING_RESERVATION_CREATED",
          `Parking reservation for ${reservation.lotId} has been created`,
          reservation.reservationId
        );
        await dbChangesService.addRecord(record);
      }
    ),
  };

  private readonly onDeleted: EventTriggerV2Function = {
    name: "onParkingReservationDeleted",
    handler: onDocumentDeleted(
      "parkingReservations/{reservationId}",
      async (document) => {
        const reservation = ParkingReservationFirestoreModel.fromDocumentData(
          document.data.data()
        );
        const record = new DbChangedRecord(
          "PARKING_RESERVATION_DELETED",
          `Parking reservation for ${reservation.lotId} has been deleted`,
          reservation.reservationId
        );
        await dbChangesService.addRecord(record);
      }
    ),
  };

  private readonly onUpdated: EventTriggerV2Function = {
    name: "onParkingReservationUpdated",
    handler: onDocumentUpdated(
      "parkingReservations/{reservationId}",
      async (document) => {
        const reservation = ParkingReservationFirestoreModel.fromDocumentData(
          document.data.after.data()
        );
        const record = new DbChangedRecord(
          "PARKING_RESERVATION_UPDATED",
          `Parking reservation for ${reservation.lotId} has been updated`,
          reservation.reservationId
        );
        await dbChangesService.addRecord(record);
      }
    ),
  };
}
