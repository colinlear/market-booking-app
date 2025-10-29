import { HttpsError, onCall } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import Stripe from "stripe";

export const domain = "http://localhost:5173";

const stripeSecret = defineSecret("STRIPE_SECRET");

export const stripeAccountFunction = onCall(
  {
    secrets: ["STRIPE_SECRET"],
  },
  async () => {
    try {
      const stripe = new Stripe(stripeSecret.value());
      const account = await stripe.accounts.create({});
      return {
        account: account.id,
      };
    } catch (e) {
      throw new HttpsError("unknown", `${e}`);
    }
  },
);
