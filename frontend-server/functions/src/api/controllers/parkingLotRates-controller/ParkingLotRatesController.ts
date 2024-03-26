import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";

import { ParkingLotRatesClientModel } from "../../../core/data/models/parkingLotRates/client/parkingLotRate-client-model";
import { PartialParkingLotRatesClientModel } from "../../../core/data/models/parkingLotRates/client/partial-parkingLotRate-client-model";
import { ParkingLotRate } from "../../../core/data/parkingLotRates";
import { parkingLotRatesService } from "../../../core/services/parkingLotRates-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { Controller, HttpServer } from "../index";

export class ParkingLotRatesController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.post("/parkingLotRates", this.createParkingLotRate.bind(this), [
      "admin",
      "driver",
      "parkingOwner",
    ]);
    httpServer.get(
      "/all-parkingLotRates",
      this.getAllParkingLotRates.bind(this),
      ["admin", "driver", "parkingOwner"]
    );
    // parkingLotrates by parkingLotId
    httpServer.get(
      "/all-parkingLotRates/:parkingLotId",
      this.getAllParkingLotRatesByParkingLotId.bind(this),
      ["admin", "driver", "parkingOwner"]
    );
    httpServer.get(
      "/parkingLotRates/:rateId",
      this.getParkingLotRateById.bind(this),
      ["admin", "driver", "parkingOwner"]
    );
    httpServer.put(
      "/parkingLotRates/:rateId",
      this.updateParkingLotRateById.bind(this),
      ["admin", "driver", "parkingOwner"]
    );
    httpServer.delete(
      "/parkingLotRates/:rateId",
      this.deleteRateById.bind(this),
      ["admin", "driver", "parkingOwner"]
    );
  }

  private readonly createParkingLotRate: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Creating parking lot rate...");

      const rateFromInput: ParkingLotRate = ParkingLotRatesClientModel.validate(
        req.body
      );
      console.log("Validated input rate:", rateFromInput);

      const createdRate = await parkingLotRatesService.createParkingLotRate(
        rateFromInput
      );
      console.log("Created rate:", createdRate);

      res.status(201).send(createdRate);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).send({ error: (error as Error).message });
    }
  };

  private readonly getAllParkingLotRates: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Getting all parking lot rates...");

      const rates = await parkingLotRatesService.getAllParkingLotRates();
      console.log("Retrieved rates:", rates);

      const parkingLotRates = rates.map((rate) =>
        ParkingLotRatesClientModel.fromEntity(rate).toBodyPublicRate()
      );
      console.log("Mapped parking lot rates:", parkingLotRates);

      res.send({ parkingLotRates: parkingLotRates });
    } catch (error) {
      console.error("Error getting parking lot rates:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  };

  private readonly getParkingLotRateById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Getting parking lot rate by ID...");

      const rateId = req.params.rateId;
      console.log("Requested rate ID:", rateId);

      const rate = await parkingLotRatesService.getParkingLotRateById(rateId);
      console.log("Retrieved rate:", rate);

      if (!rate)
        throw new HttpResponseError(404, "NOT_FOUND", "Rate not found");
      const outputRate =
        ParkingLotRatesClientModel.fromEntity(rate).toBodyPublicRate();
      console.log("Output rate:", outputRate);

      res.send(outputRate);
    } catch (error) {
      console.error("Error getting parking lot rate by ID:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  };

  private readonly getAllParkingLotRatesByParkingLotId: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Getting all parking lot rates by parking lot ID...");

      const parkingLotId = req.params.parkingLotId;
      console.log("Requested parking lot ID:", parkingLotId);

      const rates =
        await parkingLotRatesService.getAllParkingLotRatesByParkingLotId(
          parkingLotId
        );
      console.log("Retrieved rates:", rates);

      const parkingLotRates = rates.map((rate) =>
        ParkingLotRatesClientModel.fromEntity(rate).toBodyPublicRate()
      );
      console.log("Mapped parking lot rates:", parkingLotRates);

      res.send({ parkingLotRates: parkingLotRates });
    } catch (error) {
      console.error(
        "Error getting parking lot rates by parking lot ID:",
        error
      );
      res.status(500).send({ error: (error as Error).message });
    }
  };
  private readonly updateParkingLotRateById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Updating parking lot rate by ID...");

      const partialParkingLotRate = PartialParkingLotRatesClientModel.validate(
        req.body
      );
      console.log("Validated partial rate:", partialParkingLotRate);

      const rateId = req.params.rateId;
      console.log("Rate ID to update:", rateId);

      await parkingLotRatesService.updateParkingLotRateById(
        rateId,
        partialParkingLotRate
      );
      console.log(`Rate with id ${rateId} has been updated successfully.`);

      res.status(204).send({
        message: `Rate with id ${rateId} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating parking lot rate by ID:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  };

  private readonly deleteRateById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Deleting rate by ID...");

      const rateId = req.params.rateId;
      console.log("Rate ID to delete:", rateId);

      await parkingLotRatesService.deleteParkingLotRateById(rateId);
      console.log(`Rate with id ${rateId} has been deleted successfully.`);

      res.status(204).send({
        message: `Rate with id ${rateId} has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting parking lot rate by ID:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  };
}
