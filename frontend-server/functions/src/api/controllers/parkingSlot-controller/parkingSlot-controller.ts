import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { ParkingSlotClientModel } from "../../../core/data/models/parkingSlot/client/parkingSlot-client-model";
import { PartialParkingSlotClientModel } from "../../../core/data/models/parkingSlot/client/partial-parkingSlot-client-model";
import { validateNoDuplicatePositionsInList } from "../../../core/data/models/parkingSlot/client/validators";
import { ParkingSlot } from "../../../core/data/parkingSlot";
import { parkingSlotService } from "../../../core/services/parkingSlot-service-refactor";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { Controller, HttpServer } from "../index";

export class ParkingSlotController implements Controller {
  initialize(httpServer: HttpServer): void {
    //create parking lot slot
    httpServer.post(
      "/parkingSlot/:parkingLotId",
      this.createParkingSlot.bind(this),
      ["admin", "parkingOwner"]
    );

    //create multiple parking lot slots
    httpServer.post(
      "/parkingSlots-multiple/:parkingLotId",
      this.createMultipleParkingSlots.bind(this),
      ["admin", "parkingOwner"]
    );

    //get all parking lot slots
    httpServer.get(
      "/all-parkingSlots/:parkingLotId",
      this.getAllParkingSlots.bind(this),
      ["admin", "parkingOwner"]
    );

    //get parking lot slot by slotId
    httpServer.get(
      "/parkingSlot/:parkingLotId/:slotId",
      this.getParkingSlotById.bind(this),
      ["admin", "parkingOwner", "driver"]
    );

    // update parking slot by slotId
    httpServer.put(
      "/parkingSlot/:parkingLotId/:slotId",
      this.updateParkingSlotById.bind(this),
      ["admin", "parkingOwner", "driver"]
    );

    //delete parking slot by slotId
    httpServer.delete(
      "/parkingSlot/:parkingLotId/:slotId",
      this.deleteParkingSlotById.bind(this),
      ["admin", "parkingOwner"]
    );

    //Get parking lot slots by lotId
    httpServer.get(
      "/parkingSlots/:parkingLotId",
      this.getParkingSlotsByLotId.bind(this),
      ["admin", "parkingOwner", "driver"]
    );

    //delete parking slots by lotId
    httpServer.delete(
      "/all-parkingSlots/:parkingLotId",
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
      parkingSlotFromInput,
      req.auth.uid,
      req.params.parkingLotId
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
        validatedParkingSlots,
        req.auth.uid,
        req.params.parkingLotId
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
    const parkingSlots = await parkingSlotService.getParkingSlots(
      req.auth.uid,
      req.params.parkingLotId
    );
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
      req.params.slotId,
      req.auth.uid,
      req.params.parkingLotId
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
      req.auth.uid,
      req.params.parkingLotId,
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
    await parkingSlotService.deleteParkingSlotById(
      req.auth.uid,
      req.params.parkingLotId,
      req.params.slotId
    );
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
      req.auth.uid,
      req.params.parkingLotId
    );
    const outputList = parkingSlots.map((parkingSlot) =>
      ParkingSlotClientModel.fromEntity(parkingSlot).toBodyPublicParkingSlot()
    );
    res.send({ parkingSlots: outputList });
  };

  private readonly deleteParkingSlotsByLotId: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    await parkingSlotService.deleteParkingSlotsByLotId(
      req.auth.uid,
      req.params.parkingLotId
    );
    res.status(204).send({
      message:
        "All parking slots in lot " +
        req.params.lotId +
        " successfully deleted",
    });
  };
}
