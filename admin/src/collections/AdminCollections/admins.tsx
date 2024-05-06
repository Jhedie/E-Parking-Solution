import { buildCollection } from "@firecms/core";

export type Admin = {
  role: string;
  phoneNumber: string;
  email: string;
  name: string;
};

export const AdminCollection = buildCollection<Admin>({
  id: "admin",
  name: "Admin",
  group: "users",
  icon: "account_circle",
  path: "admin",
  permissions: ({ authController, user }) => ({
    read: true,
    edit: false,
    create: false,
    delete: false,
  }),
  properties: {
    name: {
      dataType: "string",
      name: "Name",
      validation: {
        required: true,
      },
    },
    role: {
      dataType: "string",
      name: "Role",
      validation: {
        required: true,
      },
      enumValues: [
        {
          id: "admin",
          label: "ADMIN",
        },
        {
          id: "parkingOwner",
          label: "PARKING LOT OWNER",
        },
        {
          id: "driver",
          label: "DRIVER",
        },
      ],
    },
    phoneNumber: {
      name: "PhoneNumber",
      dataType: "string",
      validation: {
        required: true,
      },
    },
    email: {
      name: "Email",
      dataType: "string",
      email: true,
      validation: {
        required: true,
      },
    },
  },
});
