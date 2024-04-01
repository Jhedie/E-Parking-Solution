import { buildCollection } from "@firecms/core";

export type ParkingSlots = {
  type: string;
  status: string;
  lotId: string;
  position: {
    row: string;
    column: number;
  };
};

export const ParkingSlotsCollection = buildCollection<ParkingSlots>({
  id: "parkingSlots",
  name: "ParkingSlots",
  path: "parkingSlots",
  icon: "adjust",
  permissions: ({ authController, user }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    type: {
      dataType: "string",
      enumValues: [
        {
          id: "electric",
          label: "Electric",
        },
        {
          id: "handicapped",
          label: "Handicapped",
        },
        {
          id: "motorcycle",
          label: "Motorcycle",
        },
        {
          id: "regular",
          label: "Regular",
        },
        {
          id: "Standard",
          label: "Standard",
        },
      ],
      name: "Type",
      validation: {
        required: true,
      },
    },
    status: {
      dataType: "string",
      enumValues: [
        {
          id: "Available",
          label: "Available",
        },
        {
          id: "Occupied",
          label: "Occupied",
        },
        {
          id: "Reserved",
          label: "Reserved",
        },
      ],
      name: "Status",
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

    position: {
      dataType: "map",
      name: "Position",
      properties: {
        row: {
          dataType: "string",
          name: "Row",
          editable: true,
        },
        column: {
          dataType: "number",
          name: "Column",
          editable: true,
        },
      },
    },
  },
});
