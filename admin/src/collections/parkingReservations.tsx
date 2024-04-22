import { buildCollection, buildProperty } from "@firecms/core";
import { ParkingLotRates } from "./parkingLotRates";

export type ParkingStatus =
  | "active"
  | "completed"
  | "cancelled"
  | "expired"
  | "pending"
  | "no show"
  | null;

export type PaymentStatus = "completed" | "failed" | "refunded";

export type ParkingReservation = {
  userId: string;
  slotId: string;
  lotId: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  usedRates: ParkingLotRates[];
  totalAmount: number;
  parkingStatus?: ParkingStatus;
  paymentStatus?: PaymentStatus;
  qrCodeToken?: string;
  modifiedAt?: Date;
  createdAt?: Date;
};

export const ParkingReservationCollection = buildCollection<ParkingReservation>(
  {
    id: "parkingReservations",
    name: "ParkingReservations",
    path: "parkingReservations",
    editable: true,
    icon: "book_online",
    group: "Parking",
    properties: {
      userId: {
        dataType: "string",
        name: "UserId",
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
      lotId: {
        dataType: "string",
        name: "LotId",
        validation: {
          required: true,
        },
      },
      vehicleId: {
        dataType: "string",
        name: "VehicleId",
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

      endTime: {
        dataType: "date",
        name: "EndTime",
        validation: {
          required: true,
        },
      },
      startTime: buildProperty({
        dataType: "date",
        name: "Expiry date",
        mode: "date",
      }),
      usedRates: {
        dataType: "array",
        name: "UsedRates",
        of: {
          dataType: "map",
          properties: {
            rateId: {
              dataType: "string",
              name: "RateId",
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
        },
      },
    },
  }
);
