import {
  CollectionActionsProps,
  buildCollection,
  buildProperty,
} from "@firecms/core";
import axios from "axios";
import toast from "react-hot-toast";
import { ParkingLotRates } from "./parkingLotRates";

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
  checkedOut: boolean;
  overStayedHandled: boolean;
  qrCodeToken?: string;
  modifiedAt?: Date;
  createdAt?: Date;
};

export const ParkingReservationCollection = buildCollection<ParkingReservation>(
  {
    id: "parkingReservations",
    name: "ParkingReservations",
    path: "parkingReservations",
    editable: true,
    icon: "book_online",
    group: "Parking",
    Actions: ({ selectionController, context }: CollectionActionsProps) => {
      const BASE_URL = import.meta.env.VITE_FRONTEND_SERVER_BASE_URL;
      const isAdmin = JSON.parse(
        (context.authController.user as any)?.reloadUserInfo?.customAttributes
      ).admin;

      const isApproved = JSON.parse(
        (context.authController.user as any)?.reloadUserInfo?.customAttributes
      ).approved;

      console.log(
        JSON.parse(
          (context.authController.user as any)?.reloadUserInfo?.customAttributes
        )
      );

      return (
        <>
          {isAdmin && (
            <>
              <button
                className="btn btn-danger p-2"
                onClick={() => {
                  console.log(
                    "Charge for overstaying",
                    selectionController.selectedEntities
                  );
                  console.log("Context", context);
                  console.log("reloarduserinfo", context.authController.user);

                  // send a charge to the user for overstaying
                  if (selectionController.selectedEntities) {
                    selectionController.selectedEntities.forEach((entity) => {
                      if (entity.values.overStayedHandled) {
                        toast.success(
                          `User: ${entity.values.name} has already been charged for overstaying!`
                        );
                        return;
                      }
                      context.authController
                        .getAuthToken()
                        .then((token: string) => {
                          console.log("user id", entity.id);
                          axios
                            .post(
                              `${BASE_URL}/parkingReservations/charge-overstay/${entity.values.LotId}/${entity.values.slotId}/${entity.id}`,
                              {
                                userId: entity.id,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            )
                            .then(() => {
                              toast.success(
                                `User: ${entity.values.name} has been charged for overstaying successfully!`
                              );
                            })
                            .catch((error: any) => {
                              toast.error(
                                `Failed to charge user ${entity.values.name} for overstaying: ${error}`
                              );
                            });
                        });
                    });
                  }
                }}
              >
                Charge for Overstaying
              </button>
            </>
          )}
        </>
      );
    },
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
  }
);
