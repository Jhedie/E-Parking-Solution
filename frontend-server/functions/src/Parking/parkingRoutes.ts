import { Application } from "express";

export function parkingRoutes(app: Application) {
  app.get("/parkings", (req, res) => {
    res.send("Welcome to the Parkings API");
  });
  app.post("/parkings", (req, res) => {
    res.send("Create parking");
  });
  app.get("/parkings/:id", (req, res) => {
    res.send("Get parking");
  });
  app.patch("/parkings/:id", (req, res) => {
    res.send("Update parking");
  });
  app.delete("/parkings/:id", (req, res) => {
    res.send("Delete parking");
  });
  
  //parking history
  app.get("/parkings/:id/history", (req, res) => {
    res.send("Get parking history");
  });

}
