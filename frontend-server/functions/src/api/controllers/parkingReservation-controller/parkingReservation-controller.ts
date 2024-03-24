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
      "/parkingReservations",
      this.createParkingReservation.bind(this),
      ["driver", "parkingOwner", "admin"]
    );
    httpServer.get(
      "/all-parkingReservations",
      this.getAllParkingReservations.bind(this),
      ["driver", "parkingOwner", "admin"]
    );

    httpServer.get(
      "/all-user-parkingReservations",
      this.getParkingReservationByUserId.bind(this),
      ["driver", "parkingOwner", "admin"]
    );

    httpServer.get(
      "/parkingReservations/:reservationId/full-details",
      this.getParkingReservationByIdFull.bind(this),
      ["driver", "parkingOwner", "admin"]
    );

    httpServer.get(
      "/parkingReservations/:reservationId/",
      this.getParkingReservationByIdPublic.bind(this),
      ["driver", "parkingOwner", "admin"]
    );

    httpServer.put(
      "/parkingReservations/:reservationId",
      this.updateParkingReservation.bind(this),
      ["driver", "parkingOwner", "admin"]
    );
    httpServer.delete(
      "/parkingReservations/:reservationId",
      this.deleteParkingReservation.bind(this),
      ["driver", "parkingOwner", "admin"]
    );
  }

  private readonly createParkingReservation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Creating parking reservation...");
      const parkingReservationDataInput: ParkingReservation =
        ParkingReservationClientModel.validate(req.body, req.auth.uid);

      console.log(
        "parkingReservationDataInput validated",
        parkingReservationDataInput
      );
      const createdReservation =
        await parkingReservationService.createParkingReservation(
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
          400,
          "BAD_REQUEST",
          "Error creating parking reservation."
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
        await parkingReservationService.getAllParkingReservations();

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
      await parkingReservationService.getParkingReservationById(reservationId);

    if (!reservation || reservation.userId !== req.auth.uid) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        "You do not have permission to update this reservation."
      );
    }

    await parkingReservationService.updateParkingReservationById(
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
      await parkingReservationService.getParkingReservationById(reservationId);
    if (!reservation || reservation.userId !== req.auth.uid) {
      throw new HttpResponseError(
        404,
        "NOT_FOUND",
        "Reservation " + reservationId + " not found."
      );
    }

    await parkingReservationService.deleteParkingReservationById(reservationId);
    res.status(204).send({
      message:
        "Reservation " + reservationId + " has been deleted successfully.",
    });
  };
}
