import { buildCollection } from "@firecms/core";

export type ParkingLot = {
  Capacity: number;
  LiveStatus: string;
  OperatingHours: string;
  LotName: string;
  Coordinates: {
    Longitude: string;
    Latitude: string;
  };
  LotId: string;
  Facilities: string[];
  Occupancy: number;
  Description: string;
  Owner: string;
  Address: {
    street: string;
    state: string;
    postalCode: string;
    city: string;
    country: string;
  };
};
export const ParkingLotCollection = buildCollection<ParkingLot>({
  id: "parkingLots",
  name: "ParkingLots",
  path: "parkingLots",
  editable: true,
  permissions: ({ authController, user }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    Capacity: {
      dataType: "number",
      name: "Capacity",
      validation: {
        required: true,
      },
    },
    LiveStatus: {
      dataType: "string",
      name: "LiveStatus",
      validation: {
        required: true,
      },
    },
    OperatingHours: {
      dataType: "string",
      name: "OperatingHours",
      validation: {
        required: true,
      },
    },
    LotName: {
      dataType: "string",
      name: "LotName",
      validation: {
        required: true,
      },
    },
    Coordinates: {
      dataType: "map",
      name: "Coordinates",
      properties: {
        Longitude: {
          dataType: "string",
          name: "Longitude",
          editable: true,
        },
        Latitude: {
          dataType: "string",
          name: "Latitude",
          editable: true,
        },
      },
    },
    LotId: {
      dataType: "string",
      name: "LotId",
      validation: {
        required: true,
      },
    },
    Facilities: {
      dataType: "array",
      name: "Facilities",
      of: {
        dataType: "string",
        name: "Facilities",
        editable: true,
      },
    },
    Occupancy: {
      dataType: "number",
      name: "Occupancy",
      validation: {
        required: true,
      },
    },
    Description: {
      dataType: "string",
      name: "Description",
      validation: {
        required: true,
      },
    },
    Owner: {
      dataType: "string",
      readOnly: true,
      name: "Owner",
      validation: {
        required: true,
      },
    },
    Address: {
      dataType: "map",
      name: "Address",
      properties: {
        street: {
          dataType: "string",
          name: "Street",
          editable: true,
        },
        state: {
          dataType: "string",
          name: "State",
          editable: true,
        },
        postalCode: {
          dataType: "string",
          name: "PostalCode",
          editable: true,
        },
        city: {
          dataType: "string",
          name: "City",
          editable: true,
        },
        country: {
          dataType: "string",
          name: "Country",
          editable: true,
        },
      },
    },
  },
});
