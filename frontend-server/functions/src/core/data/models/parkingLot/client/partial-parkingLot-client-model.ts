import { GeoPoint } from "firebase-admin/firestore";
import { Address, Facility, Rate } from "../../../parkingLot";

export class ParkingLot {
  constructor(
    public readonly LotId: string | undefined,
    public readonly LotName: string,
    public readonly Coordinates: GeoPoint,
    public readonly Owner: string,
    public readonly Address: Address,
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
      "", // Empty LotName
      new GeoPoint(0, 0), // Default Coordinates
      "", // Empty owner
      {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      }, // Empty Address
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
