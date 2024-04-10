import { CollectionActionsProps, buildCollection } from "@firecms/core";
import axios from "axios";
import toast from "react-hot-toast";

export type Owner = {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
};

export const ParkingOwnerCollection = buildCollection<Owner>({
  id: "parkingOwner",
  name: "ParkingOwner",
  path: "parkingOwner",
  icon: "hail",
  editable: true,
  group: "users",
  Actions: ({ selectionController, context }: CollectionActionsProps) => {
    const isAdmin = JSON.parse(
      (context.authController.user as any)?.reloadUserInfo?.customAttributes
    ).admin;

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
              className="btn btn-outline p-2"
              onClick={() => {
                console.log(
                  "User approved",
                  selectionController.selectedEntities
                );
                console.log("Context", context);
                console.log("reloarduserinfo", context.authController.user);

                // I want to change the approval claim for the selected user
                if (selectionController.selectedEntities) {
                  selectionController.selectedEntities.forEach((entity) => {
                    context.authController
                      .getAuthToken()
                      .then((token: string) => {
                        console.log("user id", entity.id);
                        axios
                          .post(
                            "https://api-b7mr63u4xa-uc.a.run.app/account/approveParkingOwner",
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
                              `User: ${entity.values.name} has been approved successfully!`
                            );
                          })
                          .catch((error: any) => {
                            toast.error(
                              `Failed to approve user ${entity.values.name}: ${error}`
                            );
                          });
                      });
                  });
                }
              }}
            >
              Approve user
            </button>
            <button
              className="btn btn-warning p-2"
              onClick={() => {
                console.log(
                  "User rejected",
                  selectionController.selectedEntities
                );
                console.log("Context", context);
                console.log(
                  "is admin",
                  ((
                    context.authController.user as any
                  )?.reloadUserInfo?.customAttributes).includes("admin")
                );

                // I want to change the rejection claim for the selected user
                if (selectionController.selectedEntities) {
                  selectionController.selectedEntities.forEach((entity) => {
                    context.authController
                      .getAuthToken()
                      .then((token: string) => {
                        console.log("user id", entity.id);
                        axios
                          .post(
                            "https://api-b7mr63u4xa-uc.a.run.app/account/rejectParkingOwner",
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
                            console.log("User claim set to false successfully");
                          })
                          .catch((error: any) => {
                            console.error(
                              "Failed to set user claim to false: ",
                              error
                            );
                          });
                      });
                  });
                }
              }}
            >
              Reject user
            </button>
          </>
        )}
      </>
    );
  },

  permissions: ({ authController, user }) => ({
    read: true,
    edit: false,
    create: false,
    delete: false,
  }),
  properties: {
    name: {
      dataType: "string",
      validation: {
        required: true,
      },
      name: "Name",
    },
    email: {
      email: true,
      name: "Email",
      dataType: "string",
      validation: {
        required: true,
      },
    },
    phoneNumber: {
      dataType: "string",
      validation: {
        required: true,
      },
      name: "PhoneNumber",
    },
    role: {
      name: "Role",
      validation: {
        required: true,
      },
      dataType: "string",
    },
    status: {
      dataType: "string",
      name: "Status",
      enumValues: [
        {
          id: "approved",
          label: "Approved",
        },
        {
          id: "rejected",
          label: "Rejected",
        },
      ],
      validation: {
        required: true,
      },
    },
  },
});
