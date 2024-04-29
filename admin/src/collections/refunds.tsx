import { buildCollection } from "@firecms/core";

export type Refund = {
  reservationId: string;
  parkingLotId: string;
  parkingSlotId: string;
  ownerId: string;
  userId: string;
  amount: number;
  status: string;
  requestedAt: Date;
};

export const RefundsCollection = buildCollection<Refund>({
  id: "refunds",
  name: "Refunds",
  path: "refunds",
  icon: "money_off",
  properties: {
    reservationId: {
      dataType: "string",
      name: "Reservation ID",
      validation: {
        required: true,
      },
    },
    parkingLotId: {
      dataType: "string",
      name: "Parking Lot ID",
      validation: {
        required: true,
      },
    },
    parkingSlotId: {
      dataType: "string",
      name: "Parking Slot ID",
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
    amount: {
      dataType: "number",
      name: "Amount",
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
    requestedAt: {
      dataType: "date",
      name: "Requested At",
      validation: {
        required: true,
      },
    },
  },
});
