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
  }

  private readonly createParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Creating parking reservation.. with body", req.body);
      const parkingReservationDataInput: ParkingReservation =
        ParkingReservationClientModel.validate(
          req.body,
          req.auth.uid,
          req.params.parkingLotId,
          req.params.parkingSlotId
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
    } catch (error) {
      next(
        new HttpResponseError(
          500,
          "BAD_REQUEST",
          "Error creating parking reservation., error: " + error
        )
      );
    }
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
}
