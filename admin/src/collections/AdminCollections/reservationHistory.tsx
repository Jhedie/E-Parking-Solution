import { buildCollection } from "@firecms/core";

export type ParkingStatus =
  | "active"
  | "completed"
  | "cancelled"
  | "expired"
  | "pending"
  | "no show"
  | "overstayed"
  | null;

export type PaymentStatus = "completed" | "failed" | "refunded";
export type ParkingLotRates = {
  rateId: string;
  rateType: string;
  rate: number;
  duration: number;
  createdAt?: Date;
};

export type Refund = {
  historyId: string;
  reservationId: string;
  cancellationStatus: string;
  historyTimestamp: Date;
  ownerId: string;
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
  checkedOut: boolean;
  overStayedHandled: boolean;
  reservationModifiedAt?: Date;
  reservationCreatedAt?: Date;
};

export const ReservationHistoryCollection = buildCollection<Refund>({
  id: "reservationHistory",
  name: "Reservation History",
  path: "reservationHistory",
  icon: "money_off",
  properties: {
    reservationId: {
      dataType: "string",
      name: "Reservation ID",
      validation: {
        required: true,
      },
    },
    historyId: {
      dataType: "string",
      name: "History ID",
      validation: {
        required: true,
      },
    },
    cancellationStatus: {
      dataType: "string",
      name: "Cancellation Status",
      validation: {
        required: true,
      },

      enumValues: [
        {
          id: "cancelled_with_refund",
          label: "Cancelled With Refund",
        },
        {
          id: "cancelled_without_refund",
          label: "Cancelled Without Refund",
        },
      ],
    },
    historyTimestamp: {
      dataType: "date",
      name: "History Timestamp",
      validation: {
        required: true,
      },
    },
    ownerId: {
      dataType: "string",
      name: "Owner ID",
      validation: {
        required: true,
      },
    },
    userId: {
      dataType: "string",
      name: "User ID",
      validation: {
        required: true,
      },
    },
    userEmail: {
      dataType: "string",
      name: "User Email",
      validation: {
        required: true,
      },
    },
    slotId: {
      dataType: "string",
      name: "Slot ID",
      validation: {
        required: true,
      },
    },
    lotId: {
      dataType: "string",
      name: "Lot ID",
      validation: {
        required: true,
      },
    },
    vehicleId: {
      dataType: "string",
      name: "Vehicle ID",
      validation: {
        required: true,
      },
    },
    startTime: {
      dataType: "date",
      name: "Start Time",
      validation: {
        required: true,
      },
    },
    endTime: {
      dataType: "date",
      name: "End Time",
      validation: {
        required: true,
      },
    },
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
    totalAmount: {
      dataType: "number",
      name: "Total Amount",
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
    checkedIn: {
      dataType: "boolean",
      name: "Checked In",
      validation: {
        required: true,
      },
    },
    checkedOut: {
      dataType: "boolean",
      name: "Checked Out",
      validation: {
        required: true,
      },
    },
    overStayedHandled: {
      dataType: "boolean",
      name: "Overstayed Handled",
      validation: {
        required: true,
      },
    },
    reservationModifiedAt: {
      dataType: "date",
      name: "Reservation Modified At",
      validation: {
        required: false,
      },
    },
    reservationCreatedAt: {
      dataType: "date",
      name: "Reservation Created At",
      validation: {
        required: false,
      },
    },
  },
});
