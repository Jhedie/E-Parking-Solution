import { buildCollection } from "@firecms/core";
export type Vehicle = {
  nickName: string;
  registrationNumber: string;
  userId: string;
  defaultVehicle: boolean;
};

export const VehicleCollection = buildCollection<Vehicle>({
  id: "vehicles",
  name: "Vehicles",
  path: "vehicles",
  singularName: "vehicle",
  icon: "directions_car_filled",
  editable: true,
  properties: {
    nickName: {
      dataType: "string",
      name: "NickName",
      validation: {
        required: true,
      },
    },
    registrationNumber: {
      dataType: "string",
      name: "RegistrationNumber",
      validation: {
        required: true,
      },
    },
    userId: {
      dataType: "string",
      readOnly: true,
      name: "UserId",
      validation: {
        required: true,
      },
    },
    defaultVehicle: {
      dataType: "boolean",
      name: "DefaultVehicle",
    },
  },
});
