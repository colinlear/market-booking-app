import { HttpsError, onCall } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import Stripe from "stripe";

const stripeSecret = defineSecret("STRIPE_SECRET");

export const stripeConnectFunction = (domain: string) =>
  onCall(
    {
      secrets: ["STRIPE_SECRET"],
    },
    async (req) => {
      // parameters
      const marketCode = req.data?.marketCode;
      const account = req.data?.account;
      if (!marketCode) {
        throw new HttpsError("invalid-argument", "Missing Market Code");
      }
      if (!account) {
        throw new HttpsError("invalid-argument", "Missing Account ID");
      }
      const stripe = new Stripe(stripeSecret.value());

      const accountLink = await stripe.accountLinks.create({
        account,
        return_url: `${domain}/${marketCode}/stripeConnect/${account}/return`,
        refresh_url: `${domain}/${marketCode}/stripeConnect/${account}/refresh`,
        type: "account_onboarding",
      });

      return accountLink;
    },
  );
