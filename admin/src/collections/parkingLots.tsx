import {
  EntityCallbacks,
  EntityOnFetchProps,
  FireCMSContext,
  buildCollection,
  buildProperty,
} from "@firecms/core";

export type ParkingLot = {
  Capacity: number;
  LiveStatus: string;
  OperatingHours: string;
  LotName: string;
  Coordinates: {
    Longitude: string;
    Latitude: string;
  };
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


const parkingOwnerCallbacks: EntityCallbacks = {
  onFetch({ collection, context, entity, path }: EntityOnFetchProps) {
    if (!context.authController.user) {
      console.log("Not permitted");
      throw new Error("Not permitted"); // Throw an error to indicate unauthorized access
    }
    return entity; // Explicitly return the entity
  },
  onPreSave: ({ collection, path, entityId, values, status, context }) => {
    if (values.Owner === "") {
      values.Owner = context.authController.user?.uid;
    }
    return values;
  },
};

export const ParkingLotCollection = buildCollection<ParkingLot>({
  id: "parkingLots",
  name: "ParkingLots",
  path: "parkingLots",
  icon: "local_parking",
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
      enumValues: [
        {
          id: "Low",
          label: "Low",
        },
        {
          id: "Medium",
          label: "Medium",
        },
        {
          id: "High",
          label: "High",
        },
      ],
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

  callbacks: parkingOwnerCallbacks,
});
