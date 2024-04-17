import { buildCollection } from "@firecms/core";
import { VehicleCollection } from "./vehicles";

export type Driver = {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
};
export const DriverCollection = buildCollection<Driver>({
  id: "driver",
  name: "Driver",
  group: "users",
  path: "driver",
  editable: true,
  icon: "sports_motorsports",
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
      validation: {
        required: true,
      },
      dataType: "string",
      name: "Role",
    },
  },
  subcollections: [VehicleCollection],
});
