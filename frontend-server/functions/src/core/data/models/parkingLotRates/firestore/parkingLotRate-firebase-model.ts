import { firestore } from "firebase-admin";
import { ParkingLotRate } from "../../../parkingLotRates";

import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;

export class ParkingLotRateFirestoreModel extends ParkingLotRate {
  static kRateId = "rateId";
  static kLotId = "lotId";
  static kRateType = "rateType";
  static kRate = "rate";
  static kNightRate = "nightRate";
  static kMinimum = "minimum";
  static kMaximum = "maximum";
  static kDiscount = "discount";
  static kDynamicPricing = "dynamicPricing";
  static kCreatedAt = "createdAt";

  /**
   * Creates an empty ParkingLotRateFirestoreModel instance.
   * @returns {ParkingLotRateFirestoreModel} - The created empty ParkingLotRateFirestoreModel instance.
   */
  static empty(): ParkingLotRateFirestoreModel {
    return new ParkingLotRateFirestoreModel(
      "", // rateId
      "", // lotId
      null, // rateType
      0, // rate
      undefined, // nightRate
      0, // minimum
      0, // maximum
      undefined, // discount
      undefined, // dynamicPricing
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
      [ParkingLotRateFirestoreModel.kLotId]: this.lotId,
      [ParkingLotRateFirestoreModel.kRateType]: this.rateType,
      [ParkingLotRateFirestoreModel.kRate]: this.rate,
      [ParkingLotRateFirestoreModel.kMinimum]: this.minimum,
      [ParkingLotRateFirestoreModel.kMaximum]: this.maximum,
      [ParkingLotRateFirestoreModel.kCreatedAt]: createdAt ?? this.createdAt,
    };

    // Optional fields
    if (this.nightRate !== undefined)
      data[ParkingLotRateFirestoreModel.kNightRate] = this.nightRate;
    if (this.discount !== undefined)
      data[ParkingLotRateFirestoreModel.kDiscount] = this.discount;
    if (this.dynamicPricing !== undefined)
      data[ParkingLotRateFirestoreModel.kDynamicPricing] = this.dynamicPricing;

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
      data[ParkingLotRateFirestoreModel.kLotId],
      data[ParkingLotRateFirestoreModel.kRateType],
      data[ParkingLotRateFirestoreModel.kRate],
      data[ParkingLotRateFirestoreModel.kNightRate],
      data[ParkingLotRateFirestoreModel.kMinimum],
      data[ParkingLotRateFirestoreModel.kMaximum],
      data[ParkingLotRateFirestoreModel.kDiscount],
      data[ParkingLotRateFirestoreModel.kDynamicPricing],
      (data[ParkingLotRateFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}
