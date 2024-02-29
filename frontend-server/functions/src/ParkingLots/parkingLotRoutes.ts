import { Application } from "express";

export function parkingLotRoutes(app: Application) {

  app.get("/parkingLots", (req, res) => {
    res.send("Welcome to the Parking Lots API");
  });
  app.post("/parkingLots", (req, res) => {
    res.send("Create parking lot");
  });
  app.get("/parkingLots/:id", (req, res) => {
    res.send("Get parking lot");
  });
  app.patch("/parkingLots/:id", (req, res) => {
    res.send("Update parking lot");
  });
  app.delete("/parkingLots/:id", (req, res) => {
    res.send("Delete parking lot");
  });
}
