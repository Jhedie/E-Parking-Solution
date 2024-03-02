import { AccountController } from "./account-controller/account-controller";
import { Controller } from "./index";

export const getControllers = (): Array<Controller> => [
  new AccountController(),
];
