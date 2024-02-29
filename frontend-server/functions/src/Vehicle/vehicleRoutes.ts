import { Application } from "express";

export function vehicleRoutes(app: Application) {
  app.get("/vehicles", (req, res) => {
    res.send("Welcome to the Vehicles API");
  });
  app.post("/vehicles", (req, res) => {
    res.send("Create vehicle");
  });
  app.get("/vehicles/:id", (req, res) => {
    res.send("Get vehicle");
  });
  app.patch("/vehicles/:id", (req, res) => {
    res.send("Update vehicle");
  });
  app.delete("/vehicles/:id", (req, res) => {
    res.send("Delete vehicle");
  });
}
