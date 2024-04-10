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
  | "Security Cameras"
  | "Motorcycle Parking"
  | string;

export type OperatingHour = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  start: string;
  end: string;
};

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
    public readonly Occupancy: number, // Number of slots occupied: This will be default 0
    public readonly LiveStatus: "Low" | "Medium" | "High", // LiveStatus: This will be default "Low"
    public readonly OperatingHours: OperatingHour[], // [day: Monday: start: "09:00", end: "17:00"...]
    public readonly Facilities: Facility[], // Facilities: This will be default []
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
      [], // No Operating Hours
      [], // No Facilities
      new Date() // Current date
    );
  }
}
