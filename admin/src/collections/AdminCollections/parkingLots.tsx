import { CollectionActionsProps, buildCollection } from "@firecms/core";
import axios from "axios";
import toast from "react-hot-toast";
import { ParkingLotRatesCollection } from "../parkingLotRates";
import { ParkingSlotsCollection } from "../parkingSlots";

export type Address = {
  streetNumber: string;
  unitNumber: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formattedAddress?: string;
};

export type Facility =
  | "EV Charging"
  | "Disabled Access"
  | "Bicycle Parking"
  | "Security Cameras"
  | "Motorcycle Parking"
  | string;

export type OperatingHour = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  start: string;
  end: string;
};

export type Coordinate = {
  Latitude: number;
  Longitude: number;
};
export type Image = string;
export type ParkingLotStatus = "Active" | "Inactive";

export type ParkingLot = {
  LotId: string;
  OwnerId: string;
  LotName: string;
  Description: string;
  Coordinates: Coordinate;
  Address: Address;
  Capacity: number;
  Occupancy: number;
  LiveStatus: "Low" | "Medium" | "High";
  OperatingHours: OperatingHour[];
  Facilities: Facility[];
  Images: Image[];
  Status: ParkingLotStatus;
  createdAt: Date;
};

export const ParkingLotCollection = buildCollection<ParkingLot>({
  id: "parkingLots",
  name: "ParkingLots",
  path: "parkingLots",
  icon: "local_parking",
  editable: false,
  permissions: ({ authController, user }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),
  Actions: ({ selectionController, context }: CollectionActionsProps) => {
    const isAdmin = JSON.parse(
      (context.authController.user as any)?.reloadUserInfo?.customAttributes
    ).admin;

    const BASE_URL = import.meta.env.VITE_FRONTEND_SERVER_BASE_URL;

    console.log("BASE_URL", BASE_URL);

    return (
      <>
        {isAdmin && (
          <>
            <button
              className="btn btn-success p-2"
              onClick={() => {
                if (selectionController.selectedEntities) {
                  selectionController.selectedEntities.forEach((entity) => {
                    context.authController
                      .getAuthToken()
                      .then((token: string) => {
                        axios
                          .post(
                            `${BASE_URL}/parkingLot/${entity.id}/approve`,
                            {
                              ownerId: entity.values.OwnerId,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          )
                          .then(() => {
                            toast.success(
                              `Parking Lot: ${entity.values.LotName} has been activated successfully!`
                            );
                          })
                          .catch((error: any) => {
                            toast.error(
                              `Failed to approve Parking Lot ${entity.values.LotName}: ${error}`
                            );
                          });
                      });
                  });
                }
              }}
            >
              Activate
            </button>
            <button
              className="btn btn-warning p-2"
              onClick={() => {
                if (selectionController.selectedEntities) {
                  selectionController.selectedEntities.forEach((entity) => {
                    context.authController
                      .getAuthToken()
                      .then((token: string) => {
                        axios
                          .post(
                            `${BASE_URL}/parkingLot/${entity.id}/revokeApproval`,
                            {
                              ownerId: entity.values.OwnerId,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          )
                          .then(() => {
                            toast.success(
                              `Parking Lot: ${entity.values.LotName} has been deactivated successfully!`
                            );
                          })
                          .catch((error: any) => {
                            toast.error(
                              `Failed to revoke approval for Parking Lot ${entity.values.LotName}: ${error}`
                            );
                          });
                      });
                  });
                }
              }}
            >
              Deactivate
            </button>
          </>
        )}
      </>
    );
  },
  group: "Parking",
  properties: {
    LotName: {
      dataType: "string",
      validation: {
        required: true,
      },
      name: "LotName",
    },
    Images: {
      dataType: "array",
      name: "Images",
      of: {
        dataType: "string",
        storage: {
          storagePath: "parkingLotImages",
          acceptedFiles: ["image/*"],
          metadata: {
            cacheControl: "max-age=31536000",
          },
        },
      },
    },
    Address: {
      properties: {
        country: {
          editable: true,
          name: "Country",
          dataType: "string",
        },
        postalCode: {
          editable: true,
          dataType: "string",
          name: "PostalCode",
        },
        city: {
          name: "City",
          dataType: "string",
          editable: true,
        },
        streetNumber: {
          editable: true,
          dataType: "string",
          name: "Street",
        },
        formattedAddress: {
          editable: true,
          name: "FormattedAddress",
          dataType: "string",
        },
        unitNumber: {
          editable: true,
          name: "UnitNumber",
          dataType: "string",
        },
        streetName: {
          name: "StreetName",
          editable: true,
          dataType: "string",
        },
        state: {
          editable: true,
          name: "State",
          dataType: "string",
        },
      },
      dataType: "map",
      name: "Address",
    },
    Capacity: {
      dataType: "number",
      name: "Capacity",
      validation: {
        required: true,
      },
    },
    Coordinates: {
      dataType: "map",
      properties: {
        Latitude: {
          dataType: "number",
          editable: true,
          name: "Lat",
        },
        Longitude: {
          name: "Long",
          dataType: "number",
          editable: true,
        },
      },
      name: "Coordinates",
    },
    Description: {
      validation: {
        required: true,
      },
      name: "Description",
      dataType: "string",
    },
    Facilities: {
      name: "Facilities",
      of: {
        editable: true,
        name: "Facilities",
        dataType: "string",
      },
      dataType: "array",
    },
    LiveStatus: {
      dataType: "string",
      validation: {
        required: true,
      },
      name: "LiveStatus",
    },
    LotId: {
      name: "LotId",
      dataType: "string",
      validation: {
        required: true,
      },
    },
    Occupancy: {
      dataType: "number",
      name: "Occupancy",
    },
    OperatingHours: {
      name: "OperatingHours",
      dataType: "array",
      of: {
        editable: true,
        dataType: "map",
        properties: {},
        name: "OperatingHours",
      },
    },
    OwnerId: {
      dataType: "string",
      name: "OwnerId",
    },
    Status: {
      dataType: "string",
      enumValues: [
        {
          id: "Active",
          label: "Active",
        },
        {
          id: "Inactive",
          label: "Inactive",
        },
      ],
      name: "Status",
      validation: {
        required: true,
      },
    },
    createdAt: {
      validation: {
        required: true,
      },
      name: "CreatedAt",
      dataType: "date",
    },
  },
  subcollections: [ParkingLotRatesCollection, ParkingSlotsCollection],
});
