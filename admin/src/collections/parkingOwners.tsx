import { buildCollection } from "@firecms/core";
import axios from "axios";

export type Owner = {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
};

export const ParkingOwnerCollection = buildCollection<Owner>({
  id: "parkingOwner",
  name: "ParkingOwner",
  path: "parkingOwner",
  icon: "hail",
  editable: true,
  group: "users",
  Actions: ({ selectionController, context }) => {
    return (
      <>
        <button
          className="btn btn-outline p-2"
          onClick={() => {
            console.log("User approved", selectionController.selectedEntities);
            console.log("Context", context);

            // I want to change the approval claim for the selected user
            if (selectionController.selectedEntities) {
              selectionController.selectedEntities.forEach((entity) => {
                context.authController.getAuthToken().then((token: string) => {
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
                      console.log("User claim set to true successfully");
                    })
                    .catch((error: any) => {
                      console.error(
                        "Failed to set user claim to true: ",
                        error
                      );
                    });
                });
              });
            }
          }}
        >
          Approve user
        </button>
      </>
    );
  },

  permissions: ({ authController, user }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
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
  },
});
