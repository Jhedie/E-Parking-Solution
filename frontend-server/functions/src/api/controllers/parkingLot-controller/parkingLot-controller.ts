import { RequestHandler } from "express";
import {
  NextFunction,
  ParamsDictionary,
  Request,
  Response,
} from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ParkingLotClientModel } from "../../../core/data/models/parkingLot/client/parkingLot-client-model";
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
  }

  private readonly createParkingLot: RequestHandler = async (
    req,
    res,
    next
  ) => {
    const parkingLotFromInput: ParkingLot = ParkingLotClientModel.validate(
      req.body,
      req.auth?.uid
    );
    const parkingLot = await parkingLotService.createParkingLot(
      parkingLotFromInput
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
    const parkingLots = await parkingLotService.getParkingLots();
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

    const parkingLot = await parkingLotService.getParkingLotById(lotId);
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
}
