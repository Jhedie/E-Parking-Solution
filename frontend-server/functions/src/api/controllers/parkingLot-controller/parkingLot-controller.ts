import { RequestHandler } from "express";
import {
  NextFunction,
  ParamsDictionary,
  Request,
  Response,
} from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ParkingLotClientModel } from "../../../core/data/models/parkingLot/client/parkingLot-client-model";
import { PartialParkingLotClientModel } from "../../../core/data/models/parkingLot/client/partial-parkingLot-client-model";
import { ParkingLot } from "../../../core/data/parkingLot";
import { parkingLotService } from "../../../core/services/parkingLot-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { Controller, HttpServer } from "../index";
export class ParkingLotController implements Controller {
  /** If claims are equal to ['driver', 'parkingOwner'], that means the same as "authenticated" */
  /** But if claims are undefined or [], that means that also unauthenticated users can access */
  initialize(httpServer: HttpServer): void {
    httpServer.post("/parkingLot", this.createParkingLot, [
      "parkingOwner",
      "admin",
    ]);

    httpServer.get("/all-parkinglots-public", this.getParkingLotListPublic, [
      "driver",
      "admin",
      "parkingOwner",
    ]);

    httpServer.get(
      "/parkingLot/:lotId/full-details",
      this.getParkingLotByIdFull,
      ["driver", "admin", "parkingOwner"]
    );

    httpServer.get("/parkingLot/:lotId", this.getParkingLotByIdPublic, [
      "driver",
      "admin",
      "parkingOwner",
    ]);

    httpServer.put("/parkingLot/:lotId", this.updateParkingLotById, [
      "parkingOwner",
      "admin",
    ]);

    httpServer.post("/parkingLot/:lotId/approve", this.approveParkingLotById, [
      "admin",
    ]);

    httpServer.post(
      "/parkingLot/:lotId/revokeApproval",
      this.revokeApprovalParkingLotById,
      ["admin"]
    );

    httpServer.delete("/parkingLot/:lotId", this.deleteParkingLotById, [
      "admin",
      "parkingOwner",
    ]);

    httpServer.post("/parkingLot/geosearch", this.geosearchParkingLots, [
      "driver",
      "admin",
      "parkingOwner",
    ]);

    httpServer.post("/create-parkingLot", this.createParkingLotFromDashboard, [
      "parkingOwner",
      "admin",
    ]);
  }

  private readonly createParkingLot: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const parkingLotFromInput: ParkingLot = ParkingLotClientModel.validate(
      req.body,
      req.auth?.uid
    );

    console.log("Creating parking lot with...", parkingLotFromInput);

    const parkingLot = await parkingLotService.createParkingLot(
      parkingLotFromInput,
      req.auth?.uid
    );
    const output =
      ParkingLotClientModel.fromEntity(parkingLot).toBodyFullParkingLot();
    res.send(output);
    next();
  };

  private readonly createParkingLotFromDashboard: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Creating parking lot from dashboard with...", req.body.body);

    const parkingLot = await parkingLotService.createParkingLotFromDashboard(
      req.body.body,
      req.auth?.uid
    );
    const output =
      ParkingLotClientModel.fromEntity(parkingLot).toBodyFullParkingLot();
    res.send(output);
    next();
  };

  private readonly getParkingLotListPublic: RequestHandler = async (
    req,
    res,
    next
  ) => {
    const parkingLots = await parkingLotService.getParkingLots(req.auth?.uid);
    const outputList = parkingLots.map((parkingLot) =>
      ParkingLotClientModel.fromEntity(parkingLot).toBodyFullParkingLot()
    );
    res.send({
      parkingLots: outputList,
    });
    next();
  };

  private readonly getParkingLotByIdPublic: RequestHandler = async (
    req,
    res,
    next
  ) => {
    //no checks needed if user is authenticated
    return this.handleGetParkingLotById(req, res, next, (parkingLot) =>
      ParkingLotClientModel.fromEntity(parkingLot).toBodyPublicParkingLot()
    );
  };

  private readonly getParkingLotByIdFull: RequestHandler = async (
    req,
    res,
    next
  ) => {
    return this.handleGetParkingLotById(req, res, next, (parkingLot) =>
      ParkingLotClientModel.fromEntity(parkingLot).toBodyFullParkingLot()
    );
  };

  private async handleGetParkingLotById(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
    next: NextFunction,
    toOutput: (parkingLot: ParkingLot) => any
  ): Promise<void> {
    const lotId = req.params["lotId"];
    if (!lotId.length) {
      throw new HttpResponseError(400, "BAD REQUEST", "Invalid parking lot id");
    }

    const parkingLot = await parkingLotService.getParkingLotById(
      req.auth?.uid,
      lotId
    );
    if (!parkingLot) {
      throw new HttpResponseError(
        404,
        "NOT FOUND",
        "Parking " + lotId + " lot not found"
      );
    }
    const output = toOutput(parkingLot);
    res.send(output);
    next();
  }

  private readonly updateParkingLotById: RequestHandler = async (
    req,
    res,
    next
  ) => {
    const parkingLotFromInput: ParkingLot = ParkingLotClientModel.validate(
      req.body,
      req.auth?.uid
    );
    if (!req.params["lotId"]?.length) {
      throw new HttpResponseError(
        400,
        "BAD REQUEST",
        "Please, inform a parking lot id on the route"
      );
    }

    const partialParkingLot =
      PartialParkingLotClientModel.validate(parkingLotFromInput);

    const parkingLot = await parkingLotService.getParkingLotById(
      req.auth?.uid,
      req.params["lotId"]
    );

    if (!parkingLot) {
      throw new HttpResponseError(
        404,
        "NOT FOUND",
        ` Parking lot ${req.params["lotId"]} not found`
      );
    }

    // only admins or parking Owners can update parking lots
    if (!(req.claims["admin"] || req.claims["parkingOwner"])) {
      throw new HttpResponseError(
        403,
        "FORBIDDEN",
        "You do not have permission to update this parking lot"
      );
    }

    await parkingLotService.updateParkingLotById(
      req.auth?.uid,
      req.params["lotId"],
      partialParkingLot
    );

    return this.handleGetParkingLotById(req, res, next, (parkingLot) =>
      ParkingLotClientModel.fromEntity(parkingLot).toBodyFullParkingLot()
    );
  };

  private readonly approveParkingLotById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Approving parking lot by ID...", req.body);
    if (!req.params["lotId"]?.length) {
      throw new HttpResponseError(
        400,
        "BAD REQUEST",
        "Please, inform a parking lot id on the route"
      );
    }

    const parkingLot = await parkingLotService.getParkingLotById(
      req.body["ownerId"],
      req.params["lotId"]
    );

    if (!parkingLot) {
      throw new HttpResponseError(
        404,
        "NOT FOUND",
        ` Parking lot ${req.params["lotId"]} not found`
      );
    }

    // only admins can approve parking lots
    if (!req.claims!["admin"]) {
      throw new HttpResponseError(
        403,
        "FORBIDDEN",
        "You do not have permission to approve this parking lot"
      );
    }
    try {
      await parkingLotService.approveParkingLotById(
        req.body["ownerId"],
        req.params["lotId"]
      );
      return res.status(200).send({
        message: `Parking lot with id ${req.params["lotId"]} has been activated successfully.`,
      });
    } catch (error: any) {
      throw new HttpResponseError(500, "INTERNAL SERVER ERROR", error.message);
    }
  };

  private readonly revokeApprovalParkingLotById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.params["lotId"]?.length) {
      throw new HttpResponseError(
        400,
        "BAD REQUEST",
        "Please, inform a parking lot id on the route"
      );
    }

    const parkingLot = await parkingLotService.getParkingLotById(
      req.body["ownerId"],
      req.params["lotId"]
    );

    if (!parkingLot) {
      throw new HttpResponseError(
        404,
        "NOT FOUND",
        ` Parking lot ${req.params["lotId"]} not found`
      );
    }

    // only admins can revoke parking lots
    if (!req.claims!["admin"]) {
      throw new HttpResponseError(
        403,
        "FORBIDDEN",
        "You do not have permission to revoke approval for this parking lot"
      );
    }
    try {
      await parkingLotService.revokeApprovalParkingLotById(
        req.body["ownerId"],
        req.params["lotId"]
      );
      res.status(200).send({
        message: `Parking lot with id ${req.params["lotId"]} has had its approval revoked successfully.`,
      });
    } catch (error: any) {
      throw new HttpResponseError(500, "INTERNAL SERVER ERROR", error.message);
    }
  };

  private readonly deleteParkingLotById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Deleting parking lot by ID...");
    if (!req.params["lotId"]?.length) {
      throw new HttpResponseError(
        400,
        "BAD REQUEST",
        "Please, inform a parking lot id on the route"
      );
    }

    const parkingLot = await parkingLotService.getParkingLotById(
      req.auth?.uid,
      req.params["lotId"]
    );

    if (!parkingLot) {
      throw new HttpResponseError(
        404,
        "NOT FOUND",
        ` Parking lot ${req.params["lotId"]} not found`
      );
    }
    console.log("claims", req.claims);

    // only admins or parking Owners can delete parking lots
    if (!(req.claims["admin"] || req.claims["parkingOwner"])) {
      throw new HttpResponseError(
        403,
        "FORBIDDEN",
        "You do not have permission to delete this parking lot"
      );
    }

    await parkingLotService.deleteParkingLotById(
      req.auth?.uid,
      req.params["lotId"]
    );
    res.status(204).send({
      message: `Parking lot with id ${req.params["lotId"]} has been deleted successfully.`,
    });
    next();
  };

  private readonly geosearchParkingLots: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Geosearching parking lots...");
    console.log("req.body", req.body);
    const { lat, lon, radius } = req.body;
    if (!lat || !lon || !radius) {
      throw new HttpResponseError(
        400,
        "BAD REQUEST",
        "Please inform lat, lon and radius on the query string"
      );
    }
    const parkingLots = await parkingLotService.geosearchParkingLots(
      parseFloat(lat as string),
      parseFloat(lon as string),
      parseFloat(radius as string)
    );
    const outputList = parkingLots.map((parkingLot) =>
      ParkingLotClientModel.fromEntity(parkingLot).toBodyFullParkingLot()
    );
    res.send({
      parkingLots: outputList,
    });
    next();
  };
}
