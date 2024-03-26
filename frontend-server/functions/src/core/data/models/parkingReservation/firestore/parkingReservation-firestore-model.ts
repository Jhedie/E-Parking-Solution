import { firestore } from "firebase-admin";
import { ParkingReservation } from "../../../parkingReservation";
import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;

export class ParkingReservationFirestoreModel extends ParkingReservation {
  static kReservationId = "reservationId";
  static kUserId = "userId";
  static kSlotId = "slotId";
  static kLotId = "lotId";
  static kStartTime = "startTime";
  static kEndTime = "endTime";
  static kRateNumber = "rateNumber";
  static kRateType = "rateType";
  static kPrice = "price";
  static kTotalAmount = "totalAmount";
  static kStatus = "status";
  static kCreatedAt = "createdAt";

  /**
   * Creates an empty ParkingReservationFirestoreModel instance.
   * @returns {ParkingReservationFirestoreModel} - The created empty instance.
   */
  static empty(): ParkingReservationFirestoreModel {
    return new ParkingReservationFirestoreModel(
      "", // reservationId
      "", // userId
      "", // slotId
      "", // lotId
      null, // startTime
      null, // endTime
      0, // rateNumber
      null, // rateType
      0, // price
      0, // totalAmount
      null, // status
      new Date() // createdAt
    );
  }

  /**
   * Creates a ParkingReservationFirestoreModel instance from a ParkingReservation entity.
   * @param {ParkingReservation} parkingReservation - The ParkingReservation entity from which to create the instance.
   * @returns {ParkingReservationFirestoreModel} - The created instance.
   */
  static fromEntity(
    parkingReservation: ParkingReservation
  ): ParkingReservationFirestoreModel {
    if (parkingReservation == null) return null;
    return Object.assign(
      ParkingReservationFirestoreModel.empty(),
      parkingReservation
    );
  }

  /**
   * Converts the instance to Firestore document data format.
   * @returns {DocumentData} Firestore document data format of the ParkingReservation.
   */
  toDocumentData(
    reservationId?: string,
    createdAt?: Timestamp | FieldValue
  ): DocumentData {
    const data: DocumentData = {
      [ParkingReservationFirestoreModel.kReservationId]:
        reservationId ?? this.reservationId,
      [ParkingReservationFirestoreModel.kUserId]: this.userId,
      [ParkingReservationFirestoreModel.kSlotId]: this.slotId,
      [ParkingReservationFirestoreModel.kLotId]: this.lotId,
      [ParkingReservationFirestoreModel.kStartTime]:
        firestore.Timestamp.fromDate(this.startTime),
      [ParkingReservationFirestoreModel.kEndTime]: firestore.Timestamp.fromDate(
        this.endTime
      ),
      [ParkingReservationFirestoreModel.kRateNumber]: this.rateNumber,
      [ParkingReservationFirestoreModel.kRateType]: this.rateType,
      [ParkingReservationFirestoreModel.kPrice]: this.price,
      [ParkingReservationFirestoreModel.kTotalAmount]: this.totalAmount,
      [ParkingReservationFirestoreModel.kStatus]: this.status,
      [ParkingReservationFirestoreModel.kCreatedAt]:
        createdAt ?? this.createdAt,
    };

    return data;
  }

  /**
   * Creates a ParkingReservationFirestoreModel instance from Firestore document data.
   * @param {DocumentData} data - The Firestore document data to convert.
   * @returns {ParkingReservationFirestoreModel} - The created instance.
   */
  static fromDocumentData(
    data: DocumentData
  ): ParkingReservationFirestoreModel {
    return new ParkingReservationFirestoreModel(
      data[ParkingReservationFirestoreModel.kReservationId],
      data[ParkingReservationFirestoreModel.kUserId],
      data[ParkingReservationFirestoreModel.kSlotId],
      data[ParkingReservationFirestoreModel.kLotId],
      (data[ParkingReservationFirestoreModel.kStartTime] as Timestamp).toDate(),
      (data[ParkingReservationFirestoreModel.kEndTime] as Timestamp).toDate(),
      data[ParkingReservationFirestoreModel.kRateNumber],
      data[ParkingReservationFirestoreModel.kRateType],
      data[ParkingReservationFirestoreModel.kPrice],
      data[ParkingReservationFirestoreModel.kTotalAmount],
      data[ParkingReservationFirestoreModel.kStatus],
      (data[ParkingReservationFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}
