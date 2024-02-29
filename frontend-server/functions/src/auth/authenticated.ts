import { Request, Response } from "express";
import * as admin from "firebase-admin";

// Middleware function to check if the user is authenticated
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: Function
) {
  // Get the authorization header from the request
  const { authorization } = req.headers;

  // If there's no authorization header, return an Unauthorized error
  if (!authorization) return res.status(401).send({ message: "Unauthorized" });

  // If the authorization header doesn't start with "Bearer", return an Unauthorized error
  if (!authorization.startsWith("Bearer"))
    return res.status(401).send({ message: "Unauthorized" });
  const split = authorization.split("Bearer ");

  // If the header doesn't have two parts after splitting on "Bearer ", return an Unauthorized error
  if (split.length !== 2)
    return res.status(401).send({ message: "Unauthorized" });

  // Get the token from the second part of the split header
  const token = split[1];

  try {
    // Verify the token with Firebase
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    console.log("decodedToken", JSON.stringify(decodedToken));

    // Set the user's uid, role, and email in the res.locals object
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
    };

    // Call the next middleware function
    return next();
  } catch (err: unknown) {
    // console.error(`${err.code} -  ${err.message}`);

    // If token verification fails, return an Unauthorized error
    return res.status(401).send({ message: "Unauthorized" });
  }
}
