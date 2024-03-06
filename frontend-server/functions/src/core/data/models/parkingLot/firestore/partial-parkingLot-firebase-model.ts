import { firestore } from "firebase-admin";
import { ParkingLot } from "../../../parkingLot";
import { ParkingLotFirestoreModel } from "./parkingLot-firebase-model";
import GeoPoint = firestore.GeoPoint;

export class PartialParkingLotFirestoreModel {
  static fromPartialEntity(
    partialParkingLot: Partial<Record<keyof ParkingLot, any>>
  ) {
    return {
      ...partialParkingLot,
      toDocumentData(): Partial<Record<string, any>> {
        const res: Partial<Record<string, any>> = {};
        if (partialParkingLot.LotId)
          res[ParkingLotFirestoreModel.kLotId] = partialParkingLot.LotId;

        if (partialParkingLot.LotName)
          res[ParkingLotFirestoreModel.kLotName] = partialParkingLot.LotName;
        if (partialParkingLot.Description)
          res[ParkingLotFirestoreModel.kDescription] =
            partialParkingLot.Description;
        // Check if Coordinates is present and ensure it's a GeoPoint
        if (partialParkingLot.Coordinates) {
          // Assuming Coordinates is either already a GeoPoint or an object with Latitude and Longitude properties
          const coordinates = partialParkingLot.Coordinates;
          if (coordinates instanceof GeoPoint) {
            res[ParkingLotFirestoreModel.kCoordinates] = coordinates;
          } else if ("Latitude" in coordinates && "Longitude" in coordinates) {
            res[ParkingLotFirestoreModel.kCoordinates] = new GeoPoint(
              coordinates.Latitude,
              coordinates.Longitude
            );
          }
        }

        if (partialParkingLot.Owner)
          res[ParkingLotFirestoreModel.kOwner] = partialParkingLot.Owner;
        if (partialParkingLot.Address)
          res[ParkingLotFirestoreModel.kAddress] = partialParkingLot.Address;
        if (partialParkingLot.Capacity)
          res[ParkingLotFirestoreModel.kCapacity] = partialParkingLot.Capacity;
        if (partialParkingLot.Occupancy)
          res[ParkingLotFirestoreModel.kOccupancy] =
            partialParkingLot.Occupancy;
        if (partialParkingLot.LiveStatus)
          res[ParkingLotFirestoreModel.kLiveStatus] =
            partialParkingLot.LiveStatus;
        if (partialParkingLot.OperatingHours)
          res[ParkingLotFirestoreModel.kOperatingHours] =
            partialParkingLot.OperatingHours;
        if (partialParkingLot.Facilities)
          res[ParkingLotFirestoreModel.kFacilities] =
            partialParkingLot.Facilities;
        if (partialParkingLot.Rates)
          res[ParkingLotFirestoreModel.kRates] = partialParkingLot.Rates;
        return res;
      },
    };
  }
}
