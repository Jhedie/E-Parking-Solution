import { RequestHandler } from "express";
import { UserClientModel } from "../../../core/data/models/user/client/user-client-model";
import { accountsService } from "../../../core/services/accounts-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { environment } from "../../../environment";
import { Controller, HttpServer } from "../index";

export class AccountController implements Controller {
  initialize(httpServer: HttpServer): void {
    //TODO to be refined for admin user
    httpServer.post("/account", this.createAccount.bind(this));
    //TODO to be removed
    httpServer.post("/account/verify", this.verifyUser.bind(this));
    httpServer.post("/account/driver", this.createDriverAccount.bind(this));
    httpServer.post(
      "/account/parkingOwner",
      this.createParkingOwnerAccount.bind(this)
    );
    httpServer.get("/account/driver/:uid", this.getDriver.bind(this));
  }

  private readonly getDriver: RequestHandler = async (req, res, next) => {
    const uid = req.params.uid;
    const user = await accountsService.getUser(uid);
    res.send(UserClientModel.fromEntity(user).toBody());
    next();
  };

  private readonly createDriverAccount: RequestHandler = async (
    req,
    res,
    next
  ) => {
    // add driver role to the  req.body to ensure security
    req.body.role = "driver";

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

  /**
   * Create a parking owner account
   * @param req
   * @param res
   * @param next
   */
  private readonly createParkingOwnerAccount: RequestHandler = async (
    req,
    res,
    next
  ) => {
    req.body.role = "parkingOwner"; // add parking owner role to the  req.body to ensure security
    const input = UserClientModel.fromBody(req.body) as UserClientModel & {
      password: string;
      adminKey: string;
    };
    if (
      !input.adminKey ||
      !environment.createAccount.adminKeys.includes(input.adminKey)
    ) {
      throw new HttpResponseError(
        401,
        "INVALID_ADMIN_KEY",
        "Unauthorized attempt to create a parking owner account."
      );
    }

    const refreshedUser = await accountsService.createAccount(
      input,
      input.password
    );

    res.send({
      user: UserClientModel.fromEntity(refreshedUser).toBody(),
    });
    next();
  };

  //TODO to be refined for admin user
  private readonly createAccount: RequestHandler = async (req, res, next) => {
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

    res.send({
      user: UserClientModel.fromEntity(refreshedUser).toBody(),
    });
    next();
  };

  private readonly verifyUser: RequestHandler = async (req, res, next) => {
    const { email } = req.body;
    const authorizationHeader = req.headers.authorization;
    console.log("authorizationHeader", authorizationHeader);
    if (!authorizationHeader) {
      // Handle the case where the Authorization header is missing
      throw new Error("Authorization header is missing");
    }

    // Extract the token from the Authorization header
    const token = authorizationHeader.split(" ")[1]; // Assuming the format is "Bearer <token>"
    console.log("token at verify user method", token);
    await accountsService.sendVerificationEmail(email, token);

    res.send({ message: "Verification email sent successfully." });
    next();
  };
}
