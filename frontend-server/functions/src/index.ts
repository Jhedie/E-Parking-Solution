import { onRequest } from "firebase-functions/v2/https";

import * as express from "express";
import { routesConfig } from "./routes-config";

import bodyParser = require("body-parser");
import cors = require("cors");

// initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to enable CORS
app.use(cors({ origin: true }));

routesConfig(app);

export const api = (exports.app = onRequest(app));
