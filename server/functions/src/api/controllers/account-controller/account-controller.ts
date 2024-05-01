import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { UserClientModel } from "../../../core/data/models/user/client/user-client-model";
import { accountsService } from "../../../core/services/accounts-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { environment } from "../../../environment";
import { Controller, HttpServer } from "../index";

export class AccountController implements Controller {
  initialize(httpServer: HttpServer): void {
    /**Admin User */
    httpServer.post("/account/admin", this.createAdminAccount.bind(this));
    httpServer.post(
      "/account/approveParkingOwner",
      this.approveParkingOwner.bind(this),
      ["admin"]
    );
    httpServer.post(
      "/account/rejectParkingOwner",
      this.rejectParkingOwner.bind(this),
      ["admin"]
    );
    /**Driver User */
    httpServer.post("/account/driver", this.createDriverAccount.bind(this));
    httpServer.get("/account/driver/:uid", this.getDriver.bind(this));

    /**Parking Owner User */
    httpServer.post(
      "/account/parkingOwner",
      this.createParkingOwnerAccount.bind(this)
    );

    /**General User */
    httpServer.delete("/account/:uid", this.deleteUser.bind(this), [
      "admin",
      "driver",
      "parkingOwner",
    ]);

    httpServer.post("/account/verify", this.verifyUser.bind(this));
  }

  /**Admin User */
  private readonly createAdminAccount: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.body.status = "";
    const input: UserClientModel & { password: string; adminKey?: string } =
      UserClientModel.fromBody(req.body);
    if (
      input.role == "admin" &&
      !environment.createAccount.adminKeys.includes(input.adminKey)
    ) {
      throw new HttpResponseError(
        401,
        "INVALID_ADMIN_KEY",
        "Please, pass a valid 'adminKey' on body"
      );
    }
    const refreshedUser = await accountsService.createAccount(
      input,
      input.password
    );

    const token = await accountsService.generateUserToken(
      input.email,
      input.password,
      refreshedUser.uid
    );

    const customToken = await accountsService.generateCustomToken(
      refreshedUser.uid
    );

    console.log("customToken", customToken);

    res.send({
      user: UserClientModel.fromEntity(refreshedUser).toBody(),
      customToken,
      token,
    });
    next();
  };
  private readonly approveParkingOwner: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Approving user req.body", req.body);
    const uid = req.body.userId;
    console.log("uid", uid);
    await accountsService.approveParkingOwner(uid);
    res.send({ message: "Parking owner approved successfully." });
    next();
  };
  private readonly rejectParkingOwner: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Rejecting user req.body", req.body);
    const uid = req.body.userId;
    console.log("uid", uid);
    await accountsService.rejectParkingOwner(uid);
    res.send({ message: "Parking owner rejected successfully." });
    next();
  };
  /**Driver User */
  private readonly createDriverAccount: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // add driver role to the  req.body to ensure security
    req.body.role = "driver";
    req.body.status = "";

    const input: UserClientModel & { password: string } =
      UserClientModel.fromBody(req.body);
    const refreshedUser = await accountsService.createAccount(
      input,
      input.password
    );

    console.log("refreshedUser", refreshedUser);
    const token = await accountsService.generateUserToken(
      input.email,
      input.password,
      refreshedUser.uid
    );

    const customToken = await accountsService.generateCustomToken(
      refreshedUser.uid
    );

    console.log("customToken", customToken);

    res.send({
      user: UserClientModel.fromEntity(refreshedUser).toBody(),
      customToken,
      token,
    });

    next();
  };
  private readonly getDriver: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const uid = req.params.uid;
    const user = await accountsService.getUser(uid);
    res.send(UserClientModel.fromEntity(user).toBody());
    next();
  };
  /**Parking Owner User */
  private readonly createParkingOwnerAccount: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.body.role = "parkingOwner"; // add parking owner role to the  req.body to ensure security
    req.body.status = "pending";
    const input = UserClientModel.fromBody(req.body) as UserClientModel & {
      password: string;
    };

    const refreshedUser = await accountsService.createAccount(
      input,
      input.password
    );

    const token = await accountsService.generateUserToken(
      input.email,
      input.password,
      refreshedUser.uid
    );

    const customToken = await accountsService.generateCustomToken(
      refreshedUser.uid
    );

    console.log("customToken", customToken);

    res.send({
      user: UserClientModel.fromEntity(refreshedUser).toBody(),
      customToken,
      token,
    });
    next();
  };
  /**General User */
  private readonly deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("Deleting user req.params", req.params);
      const uid = req.params.uid;
      await accountsService.deleteUser(uid);
      res.send({ message: "User deleted successfully." });
      next();
    } catch (error) {
      next(error);
    }
  };

  private readonly verifyUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    const authorizationHeader = req.headers.authorization;
    console.log("authorizationHeader", authorizationHeader);
    if (!authorizationHeader) {
      // Handle the case where the Authorization header is missing
      throw new Error("Authorization header is missing");
    }

    // Extract the token from the Authorization header
    const token = authorizationHeader.split(" ")[1]; // the format is "Bearer <token>"
    console.log("token at verify user method", token);
    await accountsService.sendVerificationEmail(email, token);

    res.send({ message: "Verification email sent successfully." });
    next();
  };
}
