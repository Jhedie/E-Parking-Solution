import {
  EntityCollection,
  EntityCollectionsBuilder,
  buildCollection,
  buildProperty,
} from "@firecms/core";
import { AdminCollection } from "./AdminCollections/admins";
import { DbChangesCollection } from "./AdminCollections/dbchanges";
import { DriverCollection } from "./AdminCollections/driver";
import { ParkingOwnerCollection } from "./AdminCollections/parkingOwners";
import { ReservationHistoryCollection } from "./AdminCollections/reservationHistory";
import { UserCollection } from "./AdminCollections/users";
import { ParkingReservationCollection } from "./parkingReservations";

export const collectionsBuilder: EntityCollectionsBuilder = async ({
  user,
  authController,
  dataSource,
}) => {
  const isAdmin = (() => {
    try {
      const customAttributes = (authController.user as any)?.reloadUserInfo
        ?.customAttributes;
      if (typeof customAttributes === "string") {
        return JSON.parse(customAttributes).admin;
      }
      return false; // Default to false if customAttributes is not a valid string
    } catch (error) {
      console.error("Error parsing customAttributes:", error);
      return false; // Default to false in case of parsing error
    }
  })();

  const parkingReservationSubcollection: EntityCollection = buildCollection({
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
      checkedOut: {
        dataType: "boolean",
        name: "CheckedOut",
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
        name: "ParkingStatus",
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
          {
            id: "cancelled",
            label: "Cancelled",
            color: "red",
          },
          {
            id: "no show",
            label: "No Show",
            color: "red",
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
  const parkingSlotSubcollection: EntityCollection = buildCollection({
    id: "parkingSlots",
    name: "ParkingSlots",
    path: "parkingSlots",
    icon: "calendar_view_month",

    editable: true,
    inlineEditing: true,
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
    subcollections: [parkingReservationSubcollection],
  });
  const parkingLotRatesSubcollection: EntityCollection = buildCollection({
    id: "parkingLotRates",
    name: "ParkingLotRates",
    path: "parkingLotRates",
    icon: "currency_pound",
    properties: {
      rateId: {
        dataType: "string",
        name: "Rate ID",
        validation: {
          required: true,
        },
      },
      rateType: {
        dataType: "string",
        name: "RateType",
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
      createdAt: {
        dataType: "date",
        name: "Created At",
      },
    },
  });
  const parkingOwnerParkingLots: EntityCollection = buildCollection({
    id: "parkingLots",
    name: "ParkingLots",
    path: `parkingOwner/${authController.user?.uid}/parkingLots`,
    icon: "local_parking",
    editable: true,
    group: "Parking",
    subcollections: [parkingLotRatesSubcollection, parkingSlotSubcollection],
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
        hideFromCollection: true,
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
  });

  if (!isAdmin) {
    return [parkingOwnerParkingLots];
  }
  return [
    UserCollection,
    ParkingReservationCollection,
    AdminCollection,
    DriverCollection,
    ParkingOwnerCollection,
    DbChangesCollection,
    ReservationHistoryCollection,
  ];
};
