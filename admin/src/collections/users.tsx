import { buildCollection } from "@firecms/core";
export type User = {
  name: string;
  phoneNumber: string;
  role: string;
  email: string;
};
export const UserCollection = buildCollection<User>({
  id: "users",
  name: "Users",
  path: "users",
  editable: true,
  icon: "align_horizontal_center",

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
