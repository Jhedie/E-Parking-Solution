// Importing necessary modules from express and firebase-admin
import { Request, Response } from "express";
import * as admin from "firebase-admin";

// Asynchronous function to create a new user
export async function create(req: Request, res: Response) {
  try {
    // Destructuring the request body to get user details
    const { displayName, password, email, role } = req.body;

    // Checking if all necessary details are provided
    if (!displayName || !password || !email || !role) {
      // If not, send a 400 sta tus code with a message
      return res.status(400).send({ message: "Missing fields" });
    }

    // Creating a new user using Firebase Admin SDK
    const { uid } = await admin.auth().createUser({
      displayName,
      password,
      email,
    });

    // Setting custom claims (roles) for the user
    await admin.auth().setCustomUserClaims(uid, { role });

    // If successful, send a 201 status code with the user's uid
    return res.status(201).send({ uid });
  } catch (err) {
    // If there's an error, handle it using the handleError function
    return handleError(res, err);
  }
}

function mapUser(user: admin.auth.UserRecord) {
  const customClaims = (user.customClaims || { role: "" }) as { role?: string };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}

export async function all(req: Request, res: Response) {
  try {
    // Getting all users from Firebase Auth
    const listUsers = await admin.auth().listUsers();

    // Looping through the users and adding them to the array
    const users = listUsers.users.map(mapUser);
    // Sending a 200 status code with the users array
    return res.status(200).send(users);
  } catch (err) {
    // If there's an error, handle it using the handleError function
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { displayName, password, email, role } = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({ message: "Missing fields" });
    }

    await admin.auth().updateUser(id, { displayName, password, email });
    await admin.auth().setCustomUserClaims(id, { role });
    const user = await admin.auth().getUser(id);

    return res.status(204).send({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await admin.auth().deleteUser(id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await admin.auth().getUser(id);
    return res.status(200).send({ user: mapUser(user) });
  } catch (err) {
    return handleError(res, err);
  }
}

// Function to handle errors
function handleError(res: Response, err: any) {
  // Send a 500 status code with the error message
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
