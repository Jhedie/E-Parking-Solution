import { ParkingLot } from "../../../parkingLot";
import { ParkingLotClientModel } from "./parkingLot-client-model";

export class PartialParkingLotClientModel {
  private static _validate(body: any) {
    // Add validation logic here if needed
  }

  static validate(body: any): Partial<Record<keyof ParkingLot, any>> {
    this._validate(body);
    const res: Partial<Record<keyof ParkingLot, any>> = {};
    if (body[ParkingLotClientModel.kLotName])
      res.LotName = body[ParkingLotClientModel.kLotName];
    if (body[ParkingLotClientModel.kDescription])
      res.Description = body[ParkingLotClientModel.kDescription];
    if (body[ParkingLotClientModel.kCoordinates])
      res.Coordinates = body[ParkingLotClientModel.kCoordinates];
    if (body[ParkingLotClientModel.kAddress])
      res.Address = body[ParkingLotClientModel.kAddress];
    if (body[ParkingLotClientModel.kCapacity])
      res.Capacity = body[ParkingLotClientModel.kCapacity];
    if (body[ParkingLotClientModel.kOccupancy])
      res.Occupancy = body[ParkingLotClientModel.kOccupancy];
    if (body[ParkingLotClientModel.kLiveStatus])
      res.LiveStatus = body[ParkingLotClientModel.kLiveStatus];
    if (body[ParkingLotClientModel.kOperatingHours])
      res.OperatingHours = body[ParkingLotClientModel.kOperatingHours];
    if (body[ParkingLotClientModel.kFacilities])
      res.Facilities = body[ParkingLotClientModel.kFacilities];
    if (body[ParkingLotClientModel.kStatus])
      res.status = body[ParkingLotClientModel.kStatus];
    if (body[ParkingLotClientModel.kImages])
      res.Images = body[ParkingLotClientModel.kImages];
    return res;
  }
}
