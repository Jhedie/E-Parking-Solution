import * as admin from "firebase-admin";
import * as v2 from "firebase-functions/v2";
import { apiApp } from "./api";
import { parkingLotService } from "./core/services/parkingLot-service";
import { eventTriggers } from "./event-triggers";
import { paymentApp } from "./paymentApi";
import * as ScheduledTasks from "./scheduled-functions";
const serviceAccount = require("../e-parking-app-b22cb-firebase-adminsdk-d5yi5-fb98f59c3c.json");
/**
 * User roles in the system.
 *
 * @typedef {("driver" | "parkingOwner" | "admin")} UserRole
 */
export type UserRole = "driver" | "parkingOwner" | "admin";

/**
 * Claims for the system.
 *
 * @typedef {("authenticated" | UserRole)} MyClaims
 * @todo Add OR operation with our own claims.
 */
export type MyClaims = "authenticated" | "approved" | "rejected" | UserRole;

/**
 * Initializes the Firebase Admin SDK.
 *
 * This is required to use the Firebase Admin SDK in the application.
 */
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

/**
 * Initializes the GeoFirestore service.
 *
 * This is required to use the GeoFirestore service in the application.
 */
parkingLotService.initializeGeoFirestore();

/**
 * The API endpoint for the application.
 *
 * This is a Firebase Cloud Function that is triggered by HTTP requests.
 * The function uses the Express app defined in `apiApp`.
 */
exports.api = v2.https.onRequest(apiApp);

exports.payment = v2.https.onRequest(paymentApp);

/**
 * The event triggers for the application.
 *
 * These are Firebase Cloud Functions that are triggered by events in the database.
 * The functions are defined in `./eventTriggers`.
 */
Object.assign(exports, eventTriggers());

/**
 * The scheduled tasks for the application.
 *
 * These are Firebase Cloud Functions that are triggered by a schedule.
 * The functions are defined in `./scheduledTasks`.
 *
 */

Object.assign(exports, ScheduledTasks);
