import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { Vehicle } from "../../../core/data/Vehicle";
import { PartialVehicleClientModel } from "../../../core/data/models/vehicle/client/partial-vehicle-client-model";
import { VehicleClientModel } from "../../../core/data/models/vehicle/client/vehicle-client-model";
import { vehicleService } from "../../../core/services/vehicle-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { Controller, HttpServer } from "../index";

export class VehicleController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.post("/vehicle", this.createVehicle.bind(this), ["driver"]);
    httpServer.get("/all-vehicles", this.getAllVehicles.bind(this), [
      "driver",
      "admin",
      "parkingOwner",
    ]);
    httpServer.get(
      "/all-user-vehicles",
      this.getAllVehiclesByUserId.bind(this),
      ["driver", "admin", "parkingOwner"]
    );

    httpServer.get(
      "/vehicle/:vehicleId",
      this.getVehicleByIdPublic.bind(this),
      ["driver", "admin", "parkingOwner"]
    );

    httpServer.get(
      "/vehicle/:vehicleId/full-details",
      this.getVehicleByIdFull.bind(this),
      ["driver", "admin", "parkingOwner"]
    );

    httpServer.put("/vehicle/:vehicleId", this.updateVehicleById.bind(this), [
      "driver",
      "admin",
      "parkingOwner",
    ]);

    httpServer.delete(
      "/vehicle/:vehicleId",
      this.deleteVehicleById.bind(this),
      ["driver", "admin", "parkingOwner"]
    );
  }

  private readonly createVehicle: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("In the controller for creation");
    const vehicleFromInput: Vehicle = VehicleClientModel.validate(
      req.body,
      req.auth.uid
    );
    console.log("vehicleFromInput", vehicleFromInput);
    const vehicle = await vehicleService.createVehicle(vehicleFromInput);
    const output = VehicleClientModel.fromEntity(vehicle).toBodyFullVehicle();
    res.send(output);
    next();
  };

  private readonly getAllVehicles: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const vehicles = await vehicleService.getVehicles();
    const outputList = vehicles.map((vehicle) =>
      VehicleClientModel.fromEntity(vehicle).toBodyPublicVehicle()
    );
    res.send({
      vehicles: outputList,
    });
    next();
  };

  private readonly getAllVehiclesByUserId: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.auth.uid;
    console.log("get vehicles by userId", userId);
    const vehicles = await vehicleService.getVehiclesByUserId(userId);
    const outputList = vehicles.map((vehicle) =>
      VehicleClientModel.fromEntity(vehicle).toBodyPublicVehicle()
    );
    res.send({
      vehicles: outputList,
    });
    next();
  };

  private handleGetVehicleById = async (
    req: Request,
    res: Response,
    next: NextFunction,
    toOutput: (vehicle: Vehicle) => any
  ) => {
    if (!req.params.vehicleId?.length) {
      throw new HttpResponseError(
        400,
        "BAD_REQUEST",
        "Please, inform a vehicleId on the route"
      );
    }
    const vehicle = await vehicleService.getVehicleById(
      req.params["vehicleId"]
    );
    if (!vehicle || vehicle.userId !== req.auth.uid) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        "Vehicle not found or you do not have permission to view it"
      );
    }
    res.send(toOutput(vehicle));
    next();
  };

  private readonly getVehicleByIdPublic: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.handleGetVehicleById(req, res, next, (vehicle) =>
      VehicleClientModel.fromEntity(vehicle).toBodyPublicVehicle()
    );
  };

  private readonly getVehicleByIdFull: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.handleGetVehicleById(req, res, next, (vehicle) => {
      if (!req.claims!["admin"] && vehicle.userId !== req.auth.uid) {
        throw new HttpResponseError(
          403,
          "FORBIDDEN",
          `You aren't the correct user`
        );
      }
      return VehicleClientModel.fromEntity(vehicle).toBodyFullVehicle();
    });
  };

  private readonly updateVehicleById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.params.vehicleId?.length)
      throw new HttpResponseError(
        400,
        "BAD_REQUEST",
        "Please, inform the 'vehicleId' as parameter"
      );
    const partialVehicle = PartialVehicleClientModel.validate(req.body);

    const vehicle = await vehicleService.getVehicleById(
      req.params["vehicleId"]
    );
    if (!vehicle || vehicle.userId !== req.auth.uid) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        `Vehicle ID ${req.params["vehicleId"]} not found`
      );
    }

    if (!req.claims!["admin"] && vehicle.userId !== req.auth.uid) {
      throw new HttpResponseError(
        403,
        "FORBIDDEN",
        `You aren't the correct user`
      );
    }
    await vehicleService.updateVehicleById(
      req.params["vehicleId"],
      partialVehicle
    );

    return this.handleGetVehicleById(req, res, next, (vehicle) => {
      VehicleClientModel.fromEntity(vehicle).toBodyFullVehicle();
    });
  };

  private readonly deleteVehicleById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.params["vehicleId"]?.length)
      throw new HttpResponseError(
        400,
        "BAD_REQUEST",
        "Please, inform the 'vehicleId' as parameter"
      );

    const vehicle = await vehicleService.getVehicleById(
      req.params["vehicleId"]
    );

    if (vehicle == null) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        `Vehicle ID ${req.params["vehicleId"]} not found`
      );
    }

    if (!req.claims!["admin"] && vehicle.userId !== req.auth.uid) {
      if (!req.claims!["parkingOwner"] && !req.claims!["driver"]) {
        throw new HttpResponseError(
          403,
          "FORBIDDEN",
          `You aren't authorized to delete this vehicle`
        );
      }
    }

    await vehicleService.deleteVehicleById(req.params.vehicleId);

    res.status(204).send("deleted " + req.params.vehicleId + " successfully");
    next();
  };
}
