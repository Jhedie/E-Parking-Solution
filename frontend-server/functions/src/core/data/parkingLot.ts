import { firestore } from "firebase-admin";
import GeoPoint = firestore.GeoPoint;

export type Rate = {
  RateType: string;
  Rate: number;
  NightRate?: number;
  minimum: number;
  maximum: number;
  discount?: number;
  dynamicPricing?: {
    baseRate: number;
    peakRate: number;
    offPeakRate: number;
    peakTimes: string[];
  };
};

export type Facility =
  | "EV Charging"
  | "Disabled Access"
  | "Bicycle Parking"
  | "Motorcycle Parking";

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
      "", // Operating Hours
      [], // No Facilities
      [], // No Rates
      new Date() // Current date
    );
  }
}
