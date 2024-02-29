// Importing necessary modules from express
import { Request, Response } from "express";

// Function to check if a user is authorized
export function isAuthorised(opts: {
  // The roles that are allowed to access the resource
  hasRole: Array<"admin" | "parkingOwner" | "user">;
  // Whether to allow the user to access their own data
  allowSameUser?: boolean;
}) {
  // Return an Express middleware function
  return (req: Request, res: Response, next: Function) => {
    // Destructure role, email, and uid from res.locals
    // These are set in a previous middleware function
    const { role, email, uid } = res.locals;
    // Destructure id from req.params
    // This is the ID of the resource the user is trying to access
    const { id } = req.params;

    // If the user's email is the same as the root user's email (defined in environment variables),
    // then allow the request to proceed to the next middleware function
    if (email === process.env.ROOT_USER_EMAIL) return next();

    // If allowSameUser is true, id is defined, and uid is the same as id,
    // then call next() to move to the next middleware function
    if (opts.allowSameUser && id && uid === id) return next();

    // If role is not defined, send a 403 status code and end the request
    if (!role) return res.status(403).send();

    // If the user's role is included in the allowed roles, call next()
    if (opts.hasRole.includes(role)) return next();

    // If none of the above conditions are met, send a 403 status code and end the request
    return res.status(403).send();
  };
}
