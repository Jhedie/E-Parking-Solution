import express, { Express } from "express";
import { HttpServer } from "./controllers";
import { getControllers } from "./controllers/controllers";
import { interceptors } from "./interceptors";

const apiApp: Express = express();
const httpServer = new HttpServer(apiApp);

for (let i = 0; i < interceptors.length; i++) {
  apiApp.use(interceptors[i]);
}
getControllers().forEach((controller) => {
  controller.initialize(httpServer);
});

export { apiApp };
