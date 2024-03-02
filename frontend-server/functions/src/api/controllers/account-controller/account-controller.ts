import { RequestHandler } from "express";
import { UserClientModel } from "../../../core/data/models/user/client/user-client-model";
import { accountsService } from "../../../core/services/accounts-service";
import { HttpResponseError } from "../../../core/utils/http-response-error";
import { environment } from "../../../environment";
import { Controller, HttpServer } from "../index";

export class AccountController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.post("/account", this.createAccount.bind(this));
    httpServer.get("/account/hello", this.hello.bind(this));
  }
  private readonly hello: RequestHandler = async (req, res, next) => {
    res.send({
      message: "Hello, World!",
    });
    next();
  };
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
}
