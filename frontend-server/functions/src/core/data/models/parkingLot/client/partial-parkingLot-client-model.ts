import { GeoPoint } from "firebase-admin/firestore";
import { Facility, Rate } from "../../../parkingLot";

export class ParkingLot {
  constructor(
    public readonly LotId: string | undefined,
    public readonly Coordinates: GeoPoint,
    public readonly Owner: string,
    public readonly Capacity: number,
    public readonly Occupancy: number,
    public readonly LiveStatus: "Low" | "Medium" | "High",
    public readonly Rate: string,
    public readonly OperatingHours: string,
    public readonly Facilities: Facility[],
    public readonly Rates: Rate[],
    public readonly createdAt: Date
  ) {}

  static empty() {
    return new ParkingLot(
      undefined, // LotId is undefined for an empty object
      new GeoPoint(0, 0), // Default Coordinates
      "", // Empty owner
      0, // Capacity
      0, // Occupancy
      "Low", // Default LiveStatus
      "", // Rate
      "", // OperatingHours
      [], // Facilities
      [], // Rates
      new Date() // Current date
    );
  }
}
