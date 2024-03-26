import { firestore } from "firebase-admin";
import { ParkingReservation } from "../../../parkingReservation";
import { ParkingReservationFirestoreModel } from "./parkingReservation-firestore-model";

export class PartialParkingReservationFirestoreModel {
  /**
   * Converts partial reservation data to a Firestore document format.
   * @param {Partial<Record<keyof ParkingReservation, any>>} partialReservation - A partial representation of a ParkingReservation entity.
   * @returns {Partial<Record<string, any>>} - A Firestore document data object with fields mapped to Firestore field names.
   */
  static fromPartialEntity(
    partialReservation: Partial<Record<keyof ParkingReservation, any>>
  ) {
    return {
      ...partialReservation,
      toDocumentData(): Partial<Record<string, any>> {
        const res: Partial<Record<string, any>> = {};
        if (partialReservation.slotId !== undefined) {
          res[ParkingReservationFirestoreModel.kSlotId] =
            partialReservation.slotId;
        }
        if (partialReservation.startTime !== undefined) {
          res[ParkingReservationFirestoreModel.kStartTime] =
            firestore.Timestamp.fromDate(
              new Date(partialReservation.startTime)
            );
        }
        if (partialReservation.endTime !== undefined) {
          res[ParkingReservationFirestoreModel.kEndTime] =
            firestore.Timestamp.fromDate(new Date(partialReservation.endTime));
        }
        if (partialReservation.rateNumber !== undefined) {
          res[ParkingReservationFirestoreModel.kRateNumber] =
            partialReservation.rateNumber;
        }
        if (partialReservation.rateType !== undefined) {
          res[ParkingReservationFirestoreModel.kRateType] =
            partialReservation.rateType;
        }
        if (partialReservation.price !== undefined) {
          res[ParkingReservationFirestoreModel.kPrice] =
            partialReservation.price;
        }
        if (partialReservation.totalAmount !== undefined) {
          res[ParkingReservationFirestoreModel.kTotalAmount] =
            partialReservation.totalAmount;
        }
        if (partialReservation.status !== undefined) {
          res[ParkingReservationFirestoreModel.kStatus] =
            partialReservation.status;
        }
        return res;
      },
    };
  }
}
