import { Application } from "express";
import { userRoutes } from "./Users/userRoutes";
import { parkingLotRoutes } from "./ParkingLots/parkingLotRoutes";

export function routesConfig(app: Application) {
  app.get("/", (req, res) => {
    res.send("Welcome to the Users API");
  });
  userRoutes(app);
  parkingLotRoutes(app);
}
