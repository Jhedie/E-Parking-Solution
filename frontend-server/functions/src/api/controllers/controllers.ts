import { AccountController } from "./account-controller/account-controller";
import { Controller } from "./index";
import { ParkingLotController } from "./parkingLot-controller/parkingLot-controller";
import { VehicleController } from "./vehicle-controller/vehicle-controller";

export const getControllers = (): Array<Controller> => [
  new AccountController(),
  new ParkingLotController(),
  new VehicleController(),
];
