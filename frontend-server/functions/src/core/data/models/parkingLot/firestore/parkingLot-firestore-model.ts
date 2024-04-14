import { firestore } from "firebase-admin";
import { ParkingLot } from "../../../parkingLot";
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;
import DocumentData = firestore.DocumentData;

export class ParkingLotFirestoreModel extends ParkingLot {
  static kLotId = "LotId";
  static kLotName = "LotName";
  static kDescription = "Description";
  static kCoordinates = "Coordinates";
  static kAddress = "Address";
  static kCapacity = "Capacity";
  static kOccupancy = "Occupancy";
  static kLiveStatus = "LiveStatus";
  static kRate = "Rate";
  static kOperatingHours = "OperatingHours";
  static kFacilities = "Facilities";
  static kImages = "Images";
  static kStatus = "Status";
  static kCreatedAt = "createdAt";

  static empty() {
    return new ParkingLotFirestoreModel(
      "", // LotId
      "", // LotName
      "", // Description
      null, // Default Coordinates
      {
        streetNumber: "",
        unitNumber: "",
        streetName: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        formattedAddress: "",
      }, // Empty Address
      0, // Capacity
      0, // Occupancy
      "Low", // LiveStatus
      [], // OperatingHours
      [], // Facilities
      [], // Images
      "Inactive", // Status
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
      [ParkingLotFirestoreModel.kLotName]: this.LotName,
      [ParkingLotFirestoreModel.kDescription]: this.Description,
      [ParkingLotFirestoreModel.kCoordinates]: new firestore.GeoPoint(
        this.Coordinates.Latitude,
        this.Coordinates.Longitude
      ),
      [ParkingLotFirestoreModel.kAddress]: this.Address,
      [ParkingLotFirestoreModel.kCapacity]: this.Capacity,
      [ParkingLotFirestoreModel.kOccupancy]: this.Occupancy,
      [ParkingLotFirestoreModel.kLiveStatus]: this.LiveStatus,
      [ParkingLotFirestoreModel.kOperatingHours]: this.OperatingHours,
      [ParkingLotFirestoreModel.kFacilities]: this.Facilities,
      [ParkingLotFirestoreModel.kImages]: this.Images,
      [ParkingLotFirestoreModel.kStatus]: this.status,
      [ParkingLotFirestoreModel.kCreatedAt]: createdAt ?? this.createdAt,
    };
  }

  static fromDocumentData(data: DocumentData) {
    return new ParkingLotFirestoreModel(
      data[ParkingLotFirestoreModel.kLotId],
      data[ParkingLotFirestoreModel.kLotName],
      data[ParkingLotFirestoreModel.kDescription],
      data[ParkingLotFirestoreModel.kCoordinates],
      data[ParkingLotFirestoreModel.kAddress],
      data[ParkingLotFirestoreModel.kCapacity],
      data[ParkingLotFirestoreModel.kOccupancy],
      data[ParkingLotFirestoreModel.kLiveStatus],
      data[ParkingLotFirestoreModel.kOperatingHours],
      data[ParkingLotFirestoreModel.kFacilities],
      data[ParkingLotFirestoreModel.kImages],
      data[ParkingLotFirestoreModel.kStatus],
      (data[ParkingLotFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}
