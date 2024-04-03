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
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    role: {
      name: "Role",
      dataType: "string",
      validation: {
        required: true,
      },
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
    name: {
      dataType: "string",
      name: "Name",
      validation: {
        required: true,
      },
    },
  },
});
