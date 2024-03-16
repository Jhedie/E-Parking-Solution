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
  ): Partial<Record<string, any>> {
    const documentData: Partial<Record<string, any>> = {};

    if (partialReservation.slotId !== undefined) {
      documentData[ParkingReservationFirestoreModel.kSlotId] =
        partialReservation.slotId;
    }
    if (partialReservation.startTime !== undefined) {
      documentData[ParkingReservationFirestoreModel.kStartTime] =
        firestore.Timestamp.fromDate(new Date(partialReservation.startTime));
    }
    if (partialReservation.endTime !== undefined) {
      documentData[ParkingReservationFirestoreModel.kEndTime] =
        firestore.Timestamp.fromDate(new Date(partialReservation.endTime));
    }
    if (partialReservation.rateNumber !== undefined) {
      documentData[ParkingReservationFirestoreModel.kRateNumber] =
        partialReservation.rateNumber;
    }
    if (partialReservation.rateType !== undefined) {
      documentData[ParkingReservationFirestoreModel.kRateType] =
        partialReservation.rateType;
    }
    if (partialReservation.price !== undefined) {
      documentData[ParkingReservationFirestoreModel.kPrice] =
        partialReservation.price;
    }
    if (partialReservation.totalAmount !== undefined) {
      documentData[ParkingReservationFirestoreModel.kTotalAmount] =
        partialReservation.totalAmount;
    }
    if (partialReservation.status !== undefined) {
      documentData[ParkingReservationFirestoreModel.kStatus] =
        partialReservation.status;
    }

    return documentData;
  }
}
