import { Application } from "express";
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorised } from "../auth/authorised";
import { all, create, get, patch, remove } from "./userController";

export function userRoutes(app: Application) {
  app.get("/", (req, res) => {
    res.send("Welcome to the Users API");
  });
  app.post(
    "/users",
    isAuthenticated,
    isAuthorised({ hasRole: ["admin", "parkingOwner"] }),
    create
  );
  app.get("/users", [
    isAuthenticated,
    isAuthorised({ hasRole: ["admin", "parkingOwner"] }),
    all,
  ]);
  // get :id user
  app.get("/users/:id", [
    isAuthenticated,
    isAuthorised({ hasRole: ["admin", "parkingOwner"], allowSameUser: true }),
    get,
  ]);
  // updates :id user
  app.patch("/users/:id", [
    isAuthenticated,
    isAuthorised({ hasRole: ["admin", "parkingOwner"], allowSameUser: true }),
    patch,
  ]);
  // deletes :id user
  app.delete("/users/:id", [
    isAuthenticated,
    isAuthorised({ hasRole: ["admin", "parkingOwner"] }),
    remove,
  ]);
}
