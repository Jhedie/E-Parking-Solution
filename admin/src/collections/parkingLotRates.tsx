import { buildCollection } from "@firecms/core";

export type ParkingLotRates = {
  rateType: string;
  rate: number;
  duration: number;
};

export const ParkingLotRatesCollection = buildCollection<ParkingLotRates>({
  id: "parkingLotRates",
  name: "ParkingLotRates",
  path: "parkingLotRates",
  icon: "currency_pound",
  properties: {
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
  },
});
