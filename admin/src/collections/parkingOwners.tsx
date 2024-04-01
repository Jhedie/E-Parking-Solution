import { buildCollection } from "@firecms/core";

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
  icon: "person",
  editable: true,
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
