import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const stripe = require("stripe")(
  "sk_test_51OlYLWB1AMLkBmu1CAvZ3rO65UaYiHipeJxh6ZCSjIRQ54U8pr49TePJJou0uzKvgxp7fxSEQ6GfLHF5yAxBSLzi00ZvAGqXUi"
);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

app.post("/payment-sheet", async (req, res) => {
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
  const { amount, currency, description } = req.body;
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create({
    name: req.body.customer.name,
    email: req.body.customer.email,
  });

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
    publishableKey:
      "pk_test_51OlYLWB1AMLkBmu1BFmgWiauMWOF8ceITmtOaLoEKq9lfLPk6aTfSUlBPDVBtPEgHWqSCuuMMwSfrs88Gud7LQ4k00IBlTIko7",
  });
});
