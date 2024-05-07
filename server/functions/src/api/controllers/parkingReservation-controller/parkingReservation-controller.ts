import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { ParkingReservationClientModel } from "../../../core/data/models/parkingReservation/client/parkingReservation-client-model";
import { PartialParkingReservationClientModel } from "../../../core/data/models/parkingReservation/client/partial-parkingReservation-client-model";
import { ParkingReservation } from "../../../core/data/parkingReservation";
import { parkingReservationService } from "../../../core/services/parkingReservation-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { Controller, HttpServer } from "../index";

export class ParkingReservationController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.post(
      "/parkingReservations/:parkingLotId/:parkingSlotId",
      this.createParkingReservation.bind(this),
      ["driver"]
    );

    httpServer.get(
      "/all-parkingReservations/:parkingLotId/:parkingSlotId",
      this.getAllParkingReservations.bind(this),
      ["parkingOwner", "admin"]
    );

    httpServer.get(
      "/parkingReservations/:parkingLotId/:parkingSlotId/:reservationId/full-details",
      this.getParkingReservationByIdFull.bind(this),
      ["driver"]
    );

    httpServer.get(
      "/parkingReservations/:parkingLotId/:parkingSlotId/:reservationId/public-details",
      this.getParkingReservationByIdPublic.bind(this),
      ["driver"]
    );

    httpServer.get(
      "/all-user-parkingReservations/",
      this.getParkingReservationByUserId.bind(this),
      ["driver"]
    );

    httpServer.put(
      "/parkingReservations/:parkingLotId/:parkingSlotId/:reservationId",
      this.updateParkingReservation.bind(this),
      ["driver"]
    );
    httpServer.delete(
      "/parkingReservations/:parkingLotId/:parkingSlotId/:reservationId",
      this.deleteParkingReservation.bind(this),
      ["driver"]
    );

    //driver cancel reservation
    httpServer.delete(
      "/parkingReservations/:parkingLotId/:parkingSlotId/:reservationId/cancel",
      this.cancelParkingReservation.bind(this),
      ["driver"]
    );

    //driver extend reservation
    httpServer.post(
      "/parkingReservations/:parkingLotId/:parkingSlotId/:reservationId/extend",
      this.extendParkingReservation.bind(this),
      ["driver"]
    );

    //driver report wrong occupant
    httpServer.post(
      "/parkingReservations/report-wrong-occupant",
      this.reportWrongOccupant.bind(this),
      ["driver"]
    );

    httpServer.post(
      "/parkingReservations/assign-new/:parkingLotId/:parkingSlotId",
      this.assignNewParkingReservation.bind(this),
      ["driver"]
    );

    // admin charge for overstaying
    httpServer.post(
      "/parkingReservations/charge-overstay/:parkingLotId/:parkingSlotId/:reservationId",
      this.chargeOverstay.bind(this),
      ["admin"]
    );

    httpServer.get(
      "/parkingReservations/check-if-any-reservation-made-in-slot/:parkingLotId/:parkingSlotId",
      this.checkIfAnyReservationMadeInSlot.bind(this),
      ["admin", "driver", "parkingOwner"]
    );
  }

  private readonly checkIfAnyReservationMadeInSlot: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { parkingLotId, parkingSlotId } = req.params;
    const isReserved =
      await parkingReservationService.checkIfAnyReservationMadeInSlot(
        req.auth.uid,
        parkingLotId,
        parkingSlotId
      );
    res.send({ isReserved });
  };

  private readonly createParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Creating parking reservation.. with body", req.body);
    const parkingReservationDataInput: ParkingReservation =
      ParkingReservationClientModel.validate(
        req.body,
        req.auth.uid,
        req.params.parkingSlotId,
        req.params.parkingLotId
      );

    console.log(
      "parkingReservationDataInput validated",
      parkingReservationDataInput
    );
    const createdReservation =
      await parkingReservationService.createParkingReservation(
        req.params.parkingLotId,
        req.params.parkingSlotId,
        parkingReservationDataInput
      );
    const output =
      ParkingReservationClientModel.fromEntity(
        createdReservation
      ).toBodyFullReservation();
    res.status(201).send(output);
  };

  private readonly getAllParkingReservations: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Getting all parking reservations...");
      const reservations =
        await parkingReservationService.getAllParkingReservations(
          req.params.parkingLotId,
          req.params.parkingSlotId
        );

      const outputList = reservations.map((reservation) =>
        ParkingReservationClientModel.fromEntity(
          reservation
        ).toBodyPublicReservation()
      );
      res.send({ reservations: outputList });
    } catch (error) {
      next(
        new HttpResponseError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Error fetching parking reservations."
        )
      );
    }
  };
  private handleGetParkingReservationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
    toOutput: (reservation: ParkingReservation) => any
  ) => {
    try {
      console.log("Getting parking reservation by reservation ID...");
      if (!req.params.reservationId?.length) {
        throw new HttpResponseError(
          400,
          "BAD_REQUEST",
          "Please inform a reservation ID on the route."
        );
      }
      const reservationId = req.params.reservationId;
      const reservation =
        await parkingReservationService.getParkingReservationById(
          req.params.parkingLotId,
          req.params.parkingSlotId,
          reservationId
        );
      if (!reservation || reservation.userId !== req.auth.uid) {
        throw new HttpResponseError(
          404,
          "NOT_FOUND",
          "Parking reservation not found"
        );
      } else {
        res.send(toOutput(reservation));
      }
    } catch (error) {
      next(error);
    }
  };

  private readonly getParkingReservationByIdFull: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.handleGetParkingReservationById(req, res, next, (reservation) =>
      ParkingReservationClientModel.fromEntity(
        reservation
      ).toBodyFullReservation()
    );
  };

  private readonly getParkingReservationByIdPublic: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.handleGetParkingReservationById(req, res, next, (reservation) =>
      ParkingReservationClientModel.fromEntity(
        reservation
      ).toBodyPublicReservation()
    );
  };

  private readonly getParkingReservationByUserId: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Getting parking reservation by user ID...");
      const userId = req.auth.uid;
      const reservations =
        await parkingReservationService.getParkingReservationsByUserId(userId);
      console.log("completed reservations");
      const outputList = reservations.map((reservation) =>
        ParkingReservationClientModel.fromEntity(
          reservation
        ).toBodyPublicReservation()
      );
      res.send({ reservations: outputList });
    } catch (error) {
      next(
        new HttpResponseError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Error fetching parking reservations." + error
        )
      );
    }
  };

  private readonly updateParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.params.reservationId?.length) {
      throw new HttpResponseError(
        400,
        "BAD_REQUEST",
        "Please inform a reservation ID on the route."
      );
    }

    const reservationId = req.params.reservationId;
    const partialReservationData =
      PartialParkingReservationClientModel.validate(req.body);

    const reservation =
      await parkingReservationService.getParkingReservationById(
        req.params.parkingLotId,
        req.params.parkingSlotId,
        reservationId
      );

    if (!reservation || reservation.userId !== req.auth.uid) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        "You do not have permission to update this reservation."
      );
    }

    await parkingReservationService.updateParkingReservationById(
      req.params.parkingLotId,
      req.params.parkingSlotId,
      reservationId,
      partialReservationData
    );
    return this.handleGetParkingReservationById(req, res, next, (reservation) =>
      ParkingReservationClientModel.fromEntity(
        reservation
      ).toBodyPublicReservation()
    );
  };

  private readonly deleteParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const reservationId = req.params.reservationId;

    if (!reservationId?.length) {
      throw new HttpResponseError(
        400,
        "BAD_REQUEST",
        "Please inform a reservation ID on the route."
      );
    }
    const reservation =
      await parkingReservationService.getParkingReservationById(
        req.params.parkingLotId,
        req.params.parkingSlotId,
        reservationId
      );
    if (!reservation || reservation.userId !== req.auth.uid) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        "Reservation " + reservationId + " not found."
      );
    }

    await parkingReservationService.deleteParkingReservationById(
      req.params.parkingLotId,
      req.params.parkingSlotId,
      reservationId
    );
    res.status(204).send({
      message:
        "Reservation " + reservationId + " has been deleted successfully.",
    });
  };

  private readonly cancelParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const reservationId = req.params.reservationId;

    if (!reservationId?.length) {
      throw new HttpResponseError(
        400,
        "BAD_REQUEST",
        "Please inform a reservation ID on the route."
      );
    }
    const reservation =
      await parkingReservationService.getParkingReservationById(
        req.params.parkingLotId,
        req.params.parkingSlotId,
        reservationId
      );
    if (!reservation || reservation.userId !== req.auth.uid) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        "Reservation " + reservationId + " not found."
      );
    }

    await parkingReservationService.cancelParkingReservation(
      req.params.parkingLotId,
      req.params.parkingSlotId,
      reservationId
    );
    res.status(204).send({
      message:
        "Reservation " + reservationId + " has been canceled successfully.",
    });
  };

  private readonly extendParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Extending parking reservation.. with body", req.body);
    const reservationId = req.params.reservationId;
    const lotId = req.params.parkingLotId;
    const slotId = req.params.parkingSlotId;

    const extensionStartTime = req.body.extensionStartTime;
    const extensionEndTime = req.body.extensionEndTime;
    const rate = req.body.rate;
    const totalAmount = req.body.totalAmount;
    console.group("Extending reservation");
    console.log("Extension Start Time", extensionStartTime);
    console.log("Extension End Time", extensionEndTime);
    console.log("Rate", rate);
    console.log("Total Amount", totalAmount);
    console.groupEnd();

    await parkingReservationService.extendParkingReservation(
      lotId,
      slotId,
      reservationId,
      extensionStartTime,
      extensionEndTime,
      rate,
      totalAmount
    );

    res.status(201).send({
      message: "Reservation extended successfully",
    });
  };

  private readonly reportWrongOccupant: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Reporting wrong occupant...");
    console.log("Request body", req.body);

    const result = await parkingReservationService.reportWrongOccupant(
      req.body.reservation.parkingLotDetails.LotId,
      req.body.reservation.slotDetails.slotId,
      req.body.reservation,
      req.body.registrationNumber
    );

    res.status(201).send({
      message: result,
    });
  };

  private readonly assignNewParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Assigning new parking reservation...");
    const parkingReservationDataInput: ParkingReservation =
      ParkingReservationClientModel.validate(
        req.body,
        req.auth.uid,
        req.params.parkingSlotId,
        req.params.parkingLotId,
        true
      );

    console.log(
      "parkingReservationDataInput validated",
      parkingReservationDataInput
    );
    const createdReservation =
      await parkingReservationService.createParkingReservation(
        req.params.parkingLotId,
        req.params.parkingSlotId,
        parkingReservationDataInput,
        true
      );

    //delete old reservation
    console.log(
      `Deleting old reservation in ${req.params.parkingLotId} with slotId ${req.body.oldSlotId} and reservationId ${req.body.oldReservationId}`
    );
    await parkingReservationService.deleteParkingReservation(
      req.params.parkingLotId,
      req.body.oldSlotId,
      req.body.oldReservationId
    );
    const output =
      ParkingReservationClientModel.fromEntity(
        createdReservation
      ).toBodyFullReservation();
    res.status(201).send(output);
  };

  private readonly chargeOverstay: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Charging for overstay...");

    parkingReservationService.chargeOverstay(
      req.params.parkingLotId,
      req.params.parkingSlotId,
      req.params.reservationId
    );
  };
}
