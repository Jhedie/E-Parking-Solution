import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { ParkingSlotClientModel } from "../../../core/data/models/parkingSlot/client/parkingSlot-client-model";
import { PartialParkingSlotClientModel } from "../../../core/data/models/parkingSlot/client/partial-parkingSlot-client-model";
import { validateNoDuplicatePositionsInList } from "../../../core/data/models/parkingSlot/client/validators";
import { ParkingSlot } from "../../../core/data/parkingSlot";
import { parkingSlotService } from "../../../core/services/parkingSlot-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { Controller, HttpServer } from "../index";

export class ParkingSlotController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.post("/parkingSlot", this.createParkingSlot.bind(this), [
      "admin",
      "parkingOwner",
    ]);
    httpServer.post(
      "/parkingSlots/multiple",
      this.createMultipleParkingSlots.bind(this),
      ["admin", "parkingOwner"]
    );

    httpServer.get("/all-parkingSlots", this.getAllParkingSlots.bind(this), [
      "admin",
      "parkingOwner",
    ]);
    httpServer.get("/parkingSlot/:slotId", this.getParkingSlotById.bind(this), [
      "admin",
      "parkingOwner",
    ]);
    httpServer.put(
      "/parkingSlot/:slotId",
      this.updateParkingSlotById.bind(this),
      ["admin", "parkingOwner"]
    );
    httpServer.delete(
      "/parkingSlot/:slotId",
      this.deleteParkingSlotById.bind(this),
      ["admin", "parkingOwner"]
    );
    //parking Slots by lotId
    httpServer.get(
      "/parkingSlots/:lotId",
      this.getParkingSlotsByLotId.bind(this),
      ["admin", "parkingOwner"]
    );

    //delete all parking slots
    httpServer.delete(
      "/all-parkingSlots",
      this.deleteAllParkingSlots.bind(this),
      ["admin", "parkingOwner"]
    );

    //delete parking slots by lotId
    httpServer.delete(
      "/all-parkingSlots/:lotId",
      this.deleteParkingSlotsByLotId.bind(this),
      ["admin", "parkingOwner"]
    );
  }

  private readonly createParkingSlot: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
console.log("creating parking slot with", req.body);
    const parkingSlotFromInput: ParkingSlot = ParkingSlotClientModel.validate(
      req.body
    );
console.log(parkingSlotFromInput);
    const parkingSlot = await parkingSlotService.createParkingSlot(
      parkingSlotFromInput
    );
    const output =
      ParkingSlotClientModel.fromEntity(parkingSlot).toBodyPublicParkingSlot();
    res.send(output);
  };

  private readonly createMultipleParkingSlots: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    //  req.body.slots is an array of parking slot objects
    const parkingSlotsData = req.body.slots;
    if (!Array.isArray(parkingSlotsData)) {
      throw new HttpResponseError(
        400,
        "BAD_REQUEST",
        "Expected an array of parking slots."
      );
    }
    validateNoDuplicatePositionsInList(parkingSlotsData);

    const validatedParkingSlots = parkingSlotsData.map((slotData) =>
      ParkingSlotClientModel.validate(slotData)
    );

    // Assuming parkingSlotService has a method for creating multiple slots
    const createdParkingSlots: ParkingSlot[] =
      await parkingSlotService.createMultipleParkingSlots(
        validatedParkingSlots
      );

    const outputList = createdParkingSlots.map((slot) =>
      ParkingSlotClientModel.fromEntity(slot).toBodyPublicParkingSlot()
    );

    res.status(201).send({ parkingSlots: outputList });
  };

  private readonly getAllParkingSlots: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const parkingSlots = await parkingSlotService.getParkingSlots();
    const outputList = parkingSlots.map((parkingSlot) =>
      ParkingSlotClientModel.fromEntity(parkingSlot).toBodyPublicParkingSlot()
    );
    res.send({ parkingSlots: outputList });
  };

  private readonly getParkingSlotById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const parkingSlot = await parkingSlotService.getParkingSlotById(
      req.params.slotId
    );
    if (!parkingSlot)
      throw new HttpResponseError(404, "NOT_FOUND", "Parking slot not found");

    const output =
      ParkingSlotClientModel.fromEntity(parkingSlot).toBodyPublicParkingSlot();
    res.send(output);
  };

  private readonly updateParkingSlotById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const partialParkingSlot = PartialParkingSlotClientModel.validate(req.body);
    await parkingSlotService.updateParkingSlotById(
      req.params.slotId,
      partialParkingSlot
    );
    res.status(204).send({
      message: "Parking slot " + req.params.slotId + " successfully updated",
    });
  };

  private readonly deleteParkingSlotById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    await parkingSlotService.deleteParkingSlotById(req.params.slotId);
    res.status(204).send({
      message: "Parking slot " + req.params.slotId + " successfully deleted",
    });
  };

  private readonly getParkingSlotsByLotId: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const parkingSlots = await parkingSlotService.getParkingSlotsByLotId(
      req.params.lotId
    );
    const outputList = parkingSlots.map((parkingSlot) =>
      ParkingSlotClientModel.fromEntity(parkingSlot).toBodyPublicParkingSlot()
    );
    res.send({ parkingSlots: outputList });
  };

  private readonly deleteAllParkingSlots: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    await parkingSlotService.deleteAllParkingSlots();
    res.status(204).send({ message: "All parking slots successfully deleted" });
  };

  private readonly deleteParkingSlotsByLotId: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    await parkingSlotService.deleteParkingSlotsByLotId(req.params.lotId);
    res.status(204).send({
      message:
        "All parking slots in lot " +
        req.params.lotId +
        " successfully deleted",
    });
  };
}
