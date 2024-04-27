import { buildCollection, buildEntityCallbacks } from "@firecms/core";
import { ParkingReservationCollection } from "./parkingReservations";

export type ParkingSlots = {
  slotId: string;
  type: string;
  status: string;
  position: {
    row: string;
    column: number;
  };
  createdAt?: Date;
};

// const parkingSlotCallbacks = buildEntityCallbacks<ParkingSlots>({
//   onPreSave: async (entitySaveProps) => {
//     console.log("Creating parking slot", entitySaveProps);
//     //current row and column
//     const row = entitySaveProps.values.position?.row;
//     const column = entitySaveProps.values.position?.column;

//     const parkingLotsPath = entitySaveProps.resolvedPath;

//     const positionExists = await entitySaveProps.context.dataSource
//       .fetchCollection({ path: parkingLotsPath })
//       .then((parkingSlots) => {
//         console.log("parkingSlots", parkingSlots);
//         return parkingSlots.some(
//           (parkingSlot) =>
//             parkingSlot.values.position?.row === row &&
//             parkingSlot.values.position?.column === column
//         );
//       });

//     if (positionExists) {
//       throw new Error("Position is already occupied");
//     }

//     return entitySaveProps.values;
//   },
// });

export const ParkingSlotsCollection = buildCollection<ParkingSlots>({
  id: "parkingSlots",
  name: "ParkingSlots",
  path: "parkingSlots",
  icon: "calendar_view_month",
  permissions: ({ authController, user }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),
  editable: true,
  inlineEditing: true,
  // callbacks: parkingSlotCallbacks,
  properties: {
    slotId: {
      dataType: "string",
      name: "Slot ID",
      validation: {
        required: true,
      },
    },
    type: {
      dataType: "string",
      enumValues: [
        {
          id: "electric",
          label: "Electric",
        },
        {
          id: "disabled",
          label: "Disabled",
        },

        {
          id: "regular",
          label: "Regular",
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
    createdAt: {
      dataType: "date",
      name: "Created At",
    },
  },
  subcollections: [ParkingReservationCollection],
});
