import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";

dotenv.config();

const paymentApp: Express = express();

paymentApp.use(express.json());
const corsOptions = {
  origin: "*", // Allow only this origin to access
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization", // Allowed headers
  credentials: true, // Allow cookies
};

paymentApp.use(cors(corsOptions));
paymentApp.get("/payment/hello", (req, res) => {
  res.send("Payment API Deployed and Working!");
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

paymentApp.post("/payment-sheet", async (req, res) => {
  //  body: JSON.stringify({
  //         amount: route.params.bookingDetails.totalprice, // Amount in the smallest currency unit (e.g., cents for USD)
  //         currency: "gbp",
  //         description:
  //           "Payment for parking - " +
  //           ConfirmationDetails.parkingLot.LotId +
  //           " - " +
  //           ConfirmationDetails.parkingSlot.Position.Row +
  //           ConfirmationDetails.parkingSlot.Position.Column,
  //         customer: {
  //           name: `${user?.displayName}`,
  //           email: `${user?.email}`
  //         }
  // get the detauls from the body of the request
  console.log(req.body);
  const { amount, currency } = req.body;
  // Use an existing Customer ID if this is a returning customer.

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: "cus_PowIhjjShxeRnf" },
    { apiVersion: "2023-10-16" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    customer: "cus_PowIhjjShxeRnf",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: "cus_PowIhjjShxeRnf",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

export { paymentApp };
