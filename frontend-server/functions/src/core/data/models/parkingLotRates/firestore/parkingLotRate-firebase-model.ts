import { firestore } from "firebase-admin";
import { ParkingLotRate } from "../../../parkingLotRates";

import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;

export class ParkingLotRateFirestoreModel extends ParkingLotRate {
  static kRateId = "rateId";
  static kRateType = "rateType";
  static kRate = "rate";
  static kDuration = "duration";
  static kCreatedAt = "createdAt";

  /**
   * Creates an empty ParkingLotRateFirestoreModel instance.
   * @returns {ParkingLotRateFirestoreModel} - The created empty ParkingLotRateFirestoreModel instance.
   */
  static empty(): ParkingLotRateFirestoreModel {
    return new ParkingLotRateFirestoreModel(
      "", // rateId
      null, // rateType
      0, // rate
      0, // duration
      new Date() // createdAt
    );
  }

  /**
   * Creates a ParkingLotRateFirestoreModel instance from a ParkingLotRate entity.
   * @param {ParkingLotRate} parkingLotRate - The ParkingLotRate entity from which to create the instance.
   * @returns {ParkingLotRateFirestoreModel} - The created ParkingLotRateFirestoreModel instance.
   */
  static fromEntity(
    parkingLotRate: ParkingLotRate
  ): ParkingLotRateFirestoreModel {
    if (parkingLotRate == null) return null;
    return Object.assign(ParkingLotRateFirestoreModel.empty(), parkingLotRate);
  }

  /**
   * Converts the instance to Firestore document data format.
   * @returns {DocumentData} Firestore document data format of the ParkingLotRate.
   */
  toDocumentData(
    rateId?: string,
    createdAt?: Timestamp | FieldValue
  ): DocumentData {
    const data: DocumentData = {
      [ParkingLotRateFirestoreModel.kRateId]: rateId ?? this.rateId,
      [ParkingLotRateFirestoreModel.kRateType]: this.rateType,
      [ParkingLotRateFirestoreModel.kRate]: this.rate,
      [ParkingLotRateFirestoreModel.kDuration]: this.duration,
      [ParkingLotRateFirestoreModel.kCreatedAt]: createdAt ?? this.createdAt,
    };

    if (this.duration !== undefined)
      data[ParkingLotRateFirestoreModel.kDuration] = this.duration;

    return data;
  }

  /**
   * Creates a ParkingLotRateFirestoreModel instance from Firestore document data.
   * @param {DocumentData} data - The Firestore document data to convert.
   * @returns {ParkingLotRateFirestoreModel} - The created ParkingLotRateFirestoreModel instance.
   */
  static fromDocumentData(data: DocumentData): ParkingLotRateFirestoreModel {
    return new ParkingLotRateFirestoreModel(
      data[ParkingLotRateFirestoreModel.kRateId],
      data[ParkingLotRateFirestoreModel.kRateType],
      data[ParkingLotRateFirestoreModel.kRate],
      data[ParkingLotRateFirestoreModel.kDuration],
      (data[ParkingLotRateFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}
