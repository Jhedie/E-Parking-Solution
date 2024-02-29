type Coordinates = {
  Latitude: string;
  Longitude: string;
};

type Owner = {
  OwnerId: string;
  Name: string;
};

type Rate = {
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

type Facility =
  | "EV Charging"
  | "Disabled Access"
  | "Bicycle Parking"
  | "Motorcycle Parking";

type ParkingLot = {
  LotId: string;
  Coordinates: Coordinates;
  Owner: Owner;
  Capacity: number;
  Occupancy: number;
  LiveStatus: "Low" | "Medium" | "High";
  Rate: string;
  OperatingHours: string;
  Facilities: Facility[];
  Rates: Rate[];
};
