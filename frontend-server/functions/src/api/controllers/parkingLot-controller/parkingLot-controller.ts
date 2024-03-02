import { RequestHandler } from "express";
import { ParkingLotClientModel } from "../../../core/data/models/parkingLot/client/parkingLot-client-model";
import { ParkingLot } from "../../../core/data/parkingLot";
import { parkingLotService } from "../../../core/services/parkingLot-service";
import { Controller, HttpServer } from "../index";
export class ParkingLotController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.post("/parkingLot", this.createParkingLot);
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
}
