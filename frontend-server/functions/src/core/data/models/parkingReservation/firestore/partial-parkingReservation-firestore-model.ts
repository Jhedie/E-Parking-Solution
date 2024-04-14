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
        if (partialReservation.vehicleId !== undefined) {
          res[ParkingReservationFirestoreModel.kVehicleId] =
            partialReservation.vehicleId;
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

        if (partialReservation.usedRates !== undefined) {
          res[ParkingReservationFirestoreModel.kUsedRates] =
            partialReservation.usedRates;
        }
        if (partialReservation.totalAmount !== undefined) {
          res[ParkingReservationFirestoreModel.kTotalAmount] =
            partialReservation.totalAmount;
        }
        if (partialReservation.parkingStatus !== undefined) {
          res[ParkingReservationFirestoreModel.kParkingStatus] =
            partialReservation.parkingStatus;
        }
        if (partialReservation.paymentStatus !== undefined) {
          res[ParkingReservationFirestoreModel.kPaymentStatus] =
            partialReservation.paymentStatus;
        }

        if (partialReservation.modifiedAt !== undefined) {
          res[ParkingReservationFirestoreModel.kModifiedAt] =
            firestore.Timestamp.fromDate(
              new Date(partialReservation.modifiedAt)
            );
        }

        return res;
      },
    };
  }
}
