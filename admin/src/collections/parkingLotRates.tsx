import { buildCollection } from "@firecms/core";

export type ParkingLotRates = {
  rateId: string;
  rateType: string;
  rate: number;
  duration: number;
  createdAt?: Date;
};

export const ParkingLotRatesCollection = buildCollection<ParkingLotRates>({
  id: "parkingLotRates",
  name: "ParkingLotRates",
  path: "parkingLotRates",
  icon: "currency_pound",
  properties: {
    rateId: {
      dataType: "string",
      name: "Rate ID",
      validation: {
        required: true,
      },
    },
    rateType: {
      dataType: "string",
      name: "RateType",
      validation: {
        required: true,
      },
    },
    rate: {
      dataType: "number",
      name: "Rate",
      validation: {
        required: true,
      },
    },
    duration: {
      dataType: "number",
      name: "Duration",
      validation: {
        required: true,
      },
    },
    createdAt: {
      dataType: "date",
      name: "Created At",
    },
  },
});
