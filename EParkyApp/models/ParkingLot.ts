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

export type GeoPoint = {
  _lat: number;
  _long: number;
};

export type ParkingLot = {
  LotId: string | undefined;
  LotName: string;
  Description: string;
  Coordinates: GeoPoint;
  OwnerId: string;
  Address: Address;
  Capacity: number;
  Occupancy: number;
  LiveStatus: "Low" | "Medium" | "High";
  OperatingHours: OperatingHour[];
  Facilities: Facility[];
  Images: string[];
  createdAt: Date;
};
