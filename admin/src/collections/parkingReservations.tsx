import { buildCollection } from "@firecms/core";
export type ParkingReservation = {
  rateType: string;
  slotId: string;
  totalAmount: number;
  userId: string;
  endTime: Date;
  status: string;
  startTime: Date;
  price: number;
  rateNumber: number;
  lotId: string;
};

export const ParkingReservationCollection = buildCollection<ParkingReservation>(
  {
    id: "parkingReservations",
    name: "ParkingReservations",
    path: "parkingReservations",
    editable: true,
    icon: "assistant",
    group: "",
    properties: {
      rateType: {
        dataType: "string",
        name: "RateType",
        validation: {
          required: true,
        },
      },
      slotId: {
        dataType: "string",
        name: "SlotId",
        validation: {
          required: true,
        },
      },
      totalAmount: {
        dataType: "number",
        name: "TotalAmount",
        validation: {
          required: true,
        },
      },
      userId: {
        dataType: "string",
        readOnly: true,
        name: "UserId",
        validation: {
          required: true,
        },
      },
      endTime: {
        dataType: "date",
        name: "EndTime",
        validation: {
          required: true,
        },
      },
      status: {
        dataType: "string",
        name: "Status",
        validation: {
          required: true,
        },
      },
      startTime: {
        dataType: "date",
        name: "StartTime",
        validation: {
          required: true,
        },
      },
      price: {
        dataType: "number",
        name: "Price",
        validation: {
          required: true,
        },
      },
      rateNumber: {
        dataType: "number",
        name: "RateNumber",
        validation: {
          required: true,
        },
      },
      lotId: {
        dataType: "string",
        name: "LotId",
        validation: {
          required: true,
        },
      },
    },
  }
);
