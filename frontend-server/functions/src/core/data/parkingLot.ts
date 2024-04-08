export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type Facility =
  | "EV Charging"
  | "Disabled Access"
  | "Bicycle Parking"
  | "Motorcycle Parking";

export type Coordinate = {
  Latitude: number;
  Longitude: number;
};

export class ParkingLot {
  constructor(
    public readonly LotId: string | undefined,
    public readonly LotName: string,
    public readonly Description: string,
    public readonly Coordinates: Coordinate,
    public readonly Owner: string,
    public readonly Address: Address,
    public readonly Capacity: number,
    public readonly Occupancy: number,
    public readonly LiveStatus: "Low" | "Medium" | "High",
    public readonly OperatingHours: string,
    public readonly Facilities: Facility[],
    public readonly createdAt: Date
  ) {}

  static empty() {
    return new ParkingLot(
      undefined, // LotId is undefined for an empty object
      "", // Empty LotName
      "", // Empty Description
      null, // Default Coordinates
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
      "", // Operating Hours
      [], // No Facilities
      new Date() // Current date
    );
  }
}
