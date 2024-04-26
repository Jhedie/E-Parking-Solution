import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
// import * as admin from "firebase-admin";
import Stripe from "stripe";

dotenv.config();

const paymentApp: Express = express();
const corsOptions: cors.CorsOptions = {
  origin: "*", // Allow only this origin to access
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization", // Allowed headers
  credentials: true, // Allow cookies
};

paymentApp.use(cors(corsOptions));
paymentApp.get("/payment/hello", (req: Request, res: Response) => {
  res.send("Payment API Deployed and Working!");
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;

paymentApp.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === "/webhook") {
      next();
    } else {
      express.json()(req, res, next);
    }
  }
);

paymentApp.post(
  "/webhook",
  // Stripe requires the raw body to construct the event
  express.raw({ type: "application/json" }),
  (req: express.Request, res: express.Response): void => {
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event
    console.log("✅ Success:", event.id);

    // Cast event data to Stripe object
    if (event.type === "payment_intent.succeeded") {
      const stripeObject: Stripe.PaymentIntent = event.data
        .object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
    } else if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

paymentApp.post("/payment-sheet", async (req: Request, res: Response) => {
  try {
    const { amount, currency, description, customerDetails, parkingDetails } =
      req.body;

    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        description: description,
        driverId: customerDetails.id,
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        parkingLotId: parkingDetails.lotId,
        parkingSlotId: parkingDetails.slotId,
        bookingId: parkingDetails.bookingId,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

paymentApp.post("/extend-booking", async (req: Request, res: Response) => {
  const { amount, customer, customerDetails, parkingDetails } = req.body;
  console.log("Amount: ", amount);
  console.log("Customer: ", customer);
  console.log("Customer Details: ", customerDetails);
  console.log("Parking Details: ", parkingDetails);

  if (amount > 0) {
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2023-10-16" } // Ensure this matches the API version used by your client
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "gbp",
      customer: customer,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        driverId: customerDetails.id,
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        parkingLotId: parkingDetails.lotId,
        parkingSlotId: parkingDetails.slotId,
        bookingId: parkingDetails.bookingId,
      },
    });

    res.json({
      success: true,
      message: "Booking extended successfully",
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
});

export { paymentApp };
