import { buildCollection } from "@firecms/core";
export type User = {
  name: string;
  phoneNumber: string;
  role: string;
  email: string;
};
export const UserCollection = buildCollection<User>({
  id: "users",
  name: "All Users",
  path: "users",
  group: "users",
  editable: true,
  icon: "all_inclusive",

  permissions: ({ authController, user }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    name: {
      dataType: "string",
      name: "Name",
      validation: {
        required: true,
      },
    },
    phoneNumber: {
      dataType: "string",
      name: "PhoneNumber",
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
    email: {
      dataType: "string",
      email: true,
      name: "Email",
      validation: {
        required: true,
      },
    },
  },
});
