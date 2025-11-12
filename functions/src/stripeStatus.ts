import { HttpsError, onCall } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import Stripe from "stripe";

const stripeSecret = defineSecret("STRIPE_SECRET");

export const stripeStatusFunction = onCall(
  {
    secrets: ["STRIPE_SECRET"],
  },
  async (req) => {
    // parameters
    const accountId = req.data?.account;
    try {
      const stripe = new Stripe(stripeSecret.value());
      const account = await stripe.accounts.retrieve(accountId);
      return {
        account: account.id,
        name: account.business_profile?.name ?? "-",
        status: account.requirements?.disabled_reason ?? "active",
        payments: (account.capabilities?.card_payments ?? "") === "active",
      };
    } catch (e) {
      throw new HttpsError("unknown", `${e}`);
    }
  }
);
