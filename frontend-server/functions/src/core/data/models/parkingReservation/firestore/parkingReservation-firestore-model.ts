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
  static kVehicleId = "vehicleId";
  static kStartTime = "startTime";
  static kEndTime = "endTime";
  static kUsedRates = "usedRates";
  static kTotalAmount = "totalAmount";
  static kParkingStatus = "parkingStatus";
  static kPaymentStatus = "paymentStatus";
  static kQrCodeToken = "qrCodeToken";
  static kModifiedAt = "modifiedAt";
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
      "", // vehicleId
      null, // startTime
      null, // endTime
      [], // usedRates
      0, // totalAmount
      null, // parkingStatus
      null, // paymentStatus
      "", // qrCodeToken
      new Date(), // modifiedAt
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
    qrCodeToken: string,
    createdAt: Timestamp | FieldValue,
    reservationId: string
  ): DocumentData {
    const data: DocumentData = {
      [ParkingReservationFirestoreModel.kReservationId]:
        reservationId ?? this.reservationId,
      [ParkingReservationFirestoreModel.kUserId]: this.userId,
      [ParkingReservationFirestoreModel.kSlotId]: this.slotId,
      [ParkingReservationFirestoreModel.kLotId]: this.lotId,
      [ParkingReservationFirestoreModel.kVehicleId]: this.vehicleId,
      [ParkingReservationFirestoreModel.kStartTime]:
        firestore.Timestamp.fromDate(this.startTime),
      [ParkingReservationFirestoreModel.kEndTime]: firestore.Timestamp.fromDate(
        this.endTime
      ),
      [ParkingReservationFirestoreModel.kUsedRates]: this.usedRates,
      [ParkingReservationFirestoreModel.kTotalAmount]: this.totalAmount,
      [ParkingReservationFirestoreModel.kParkingStatus]: this.parkingStatus,
      [ParkingReservationFirestoreModel.kPaymentStatus]: this.paymentStatus,
      [ParkingReservationFirestoreModel.kQrCodeToken]:
        qrCodeToken ?? this.qrCodeToken,
      [ParkingReservationFirestoreModel.kModifiedAt]:
        this.modifiedAt ?? createdAt,
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
      data[ParkingReservationFirestoreModel.kVehicleId],
      (data[ParkingReservationFirestoreModel.kStartTime] as Timestamp).toDate(),
      (data[ParkingReservationFirestoreModel.kEndTime] as Timestamp).toDate(),
      data[ParkingReservationFirestoreModel.kUsedRates],
      data[ParkingReservationFirestoreModel.kTotalAmount],
      data[ParkingReservationFirestoreModel.kParkingStatus],
      data[ParkingReservationFirestoreModel.kPaymentStatus],
      data[ParkingReservationFirestoreModel.kQrCodeToken],
      (
        data[ParkingReservationFirestoreModel.kModifiedAt] as Timestamp
      ).toDate(),
      (data[ParkingReservationFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}
