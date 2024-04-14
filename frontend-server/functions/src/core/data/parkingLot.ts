export type Address = {
  streetNumber: string;
  unitNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formattedAddress?: string;
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
export type Image = string;
export type ParkingLotStatus = "Active" | "Inactive";

export class ParkingLot {
  constructor(
    public readonly LotId: string | undefined,
    public readonly LotName: string,
    public readonly Description: string,
    public readonly Coordinates: Coordinate,
    public readonly Address: Address,
    public readonly Capacity: number,
    public readonly Occupancy: number, // Number of slots occupied: This will be default 0
    public readonly LiveStatus: "Low" | "Medium" | "High", // LiveStatus: This will be default "Low"
    public readonly OperatingHours: OperatingHour[], // [day: Monday: start: "09:00", end: "17:00"...]
    public readonly Facilities: Facility[], // Facilities: This will be default []
    public readonly Images: Image[], // Images: This will be default []
    public readonly status: ParkingLotStatus, // Status: This will be default "Inactive"
    public readonly createdAt: Date
  ) {}

  static empty() {
    return new ParkingLot(
      undefined, // LotId is undefined for an empty object
      "", // Empty LotName
      "", // Empty Description
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
      "Low", // Default LiveStatus
      [], // No Operating Hours
      [], // No Facilities
      [], // No Images
      "Inactive", // Default status
      new Date() // Current date
    );
  }
}
