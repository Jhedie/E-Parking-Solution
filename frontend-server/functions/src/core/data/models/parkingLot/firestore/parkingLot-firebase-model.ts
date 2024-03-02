import { firestore } from "firebase-admin";
import { ParkingLot } from "../../../parkingLot";
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;
import DocumentData = firestore.DocumentData;
import { GeoPoint } from "firebase-admin/firestore";

export class ParkingLotFirestoreModel extends ParkingLot {
  static kLotId = "LotId";
  static kCoordinates = "Coordinates";
  static kOwner = "Owner";
  static kCapacity = "Capacity";
  static kOccupancy = "Occupancy";
  static kLiveStatus = "LiveStatus";
  static kRate = "Rate";
  static kOperatingHours = "OperatingHours";
  static kFacilities = "Facilities";
  static kRates = "Rates";
  static kCreatedAt = "createdAt";

  static empty() {
    return new ParkingLotFirestoreModel(
      "", // LotId
      new GeoPoint(0, 0), // Default Coordinates as a GeoPoint
      "", // Owner
      0, // Capacity
      0, // Occupancy
      "Low", // LiveStatus
      "", // Rate
      "", // OperatingHours
      [], // Facilities
      [], // Rates
      new Date() // Current date
    );
  }

  /**
   * This method is used to convert a ParkingLot entity to a ParkingLotFirestoreModel
   * @param parkingLot
   * @returns
   */
  static fromEntity(parkingLot?: ParkingLot): ParkingLotFirestoreModel | null {
    if (parkingLot == null) return null;
    return Object.assign(ParkingLotFirestoreModel.empty(), parkingLot);
  }

  toDocumentData(lotId?: string, createdAt?: Timestamp | FieldValue) {
    return {
      [ParkingLotFirestoreModel.kLotId]: lotId ?? this.LotId,
      [ParkingLotFirestoreModel.kCoordinates]: this.Coordinates,
      [ParkingLotFirestoreModel.kOwner]: this.Owner,
      [ParkingLotFirestoreModel.kCapacity]: this.Capacity,
      [ParkingLotFirestoreModel.kOccupancy]: this.Occupancy,
      [ParkingLotFirestoreModel.kLiveStatus]: this.LiveStatus,
      [ParkingLotFirestoreModel.kRate]: this.Rate,
      [ParkingLotFirestoreModel.kOperatingHours]: this.OperatingHours,
      [ParkingLotFirestoreModel.kFacilities]: this.Facilities,
      [ParkingLotFirestoreModel.kRates]: this.Rates,
      [ParkingLotFirestoreModel.kCreatedAt]: createdAt ?? this.createdAt,
    };
  }

  static fromDocumentData(data: DocumentData) {
    return new ParkingLotFirestoreModel(
      data[ParkingLotFirestoreModel.kLotId],
      data[ParkingLotFirestoreModel.kCoordinates], // Assumes GeoPoint is directly stored
      data[ParkingLotFirestoreModel.kOwner],
      data[ParkingLotFirestoreModel.kCapacity],
      data[ParkingLotFirestoreModel.kOccupancy],
      data[ParkingLotFirestoreModel.kLiveStatus],
      data[ParkingLotFirestoreModel.kRate],
      data[ParkingLotFirestoreModel.kOperatingHours],
      data[ParkingLotFirestoreModel.kFacilities],
      data[ParkingLotFirestoreModel.kRates],
      (data[ParkingLotFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}
