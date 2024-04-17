import {
  EntityOnPreSaveProps,
  buildCollection,
  buildEntityCallbacks,
} from "@firecms/core";
import { ParkingReservationCollection } from "./parkingReservations";

export type ParkingSlots = {
  type: string;
  status: string;
  lotId: string;
  position: {
    row: string;
    column: number;
  };
};

const checkIfPositionIsAvailable = async (
  entitySaveProps: EntityOnPreSaveProps
): Promise<boolean> => {
  const allParkingSlots =
    await entitySaveProps.context.dataSource.fetchCollection<ParkingSlots>({
      path: "parkingSlots",
    });

  const isAvailable =
    allParkingSlots.filter(
      (slot) =>
        slot.values.position.row === entitySaveProps.values.position.row &&
        slot.values.position.column === entitySaveProps.values.position.column
    ).length === 0;

  return isAvailable;
};

const parkingSlotCallbacks = buildEntityCallbacks<ParkingSlots>({
  onPreSave: async (entitySaveProps) => {
    console.log("Creating parking slot", entitySaveProps);
    //check if the position is already avalable
    const isPositionAvailable = await checkIfPositionIsAvailable(
      entitySaveProps
    );

    if (isPositionAvailable) {
      console.log("Position is available");
      return entitySaveProps;
    } else {
      throw new Error("Position is already occupied");
    }
  },
});

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
  callbacks: parkingSlotCallbacks,
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
  subcollections: [ParkingReservationCollection],
  initialSort: ["position", "asc"],
});
