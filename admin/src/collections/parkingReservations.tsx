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
  userEmail: string;
  slotId: string;
  lotId: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  usedRates: ParkingLotRates[];
  totalAmount: number;
  parkingStatus: ParkingStatus;
  paymentStatus: PaymentStatus;
  checkedIn: boolean;
  overStayedHandled:boolean;
  qrCodeToken?: string;
  modifiedAt?: Date;
  createdAt?: Date;
};

export const ParkingReservationCollection = buildCollection<ParkingReservation>({
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
    checkedIn: {
      dataType: "boolean",
      name: "CheckedIn",
      validation: {
        required: true,
      },
    },
    overStayedHandled: {
      dataType: "boolean",
      name: "OverStayedHandled",
      validation: {
        required: true,
      },
    },
    paymentStatus: {
      dataType: "string",
      name: "PaymentStatus",
      validation: {
        required: true,
      },
      enumValues: [
        {
          id: "completed",
          label: "Completed",
        },
        {
          id: "failed",
          label: "Failed",
        },
        {
          id: "refunded",
          label: "Refunded",
        },
      ],
    },
    userEmail: {
      dataType: "string",
      name: "UserEmail",
      validation: {
        required: true,
      },
    },
    parkingStatus: {
      dataType: "string",
      name: "Role",
      validation: {
        required: true,
      },
      enumValues: [
        {
          id: "expired",
          label: "Expired",
          color: "red",
        },
        {
          id: "active",
          label: "Active",
          color: "green",
        },
        {
          id: "pending",
          label: "Pending",
          color: "yellow",
        },
      ],
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
});
