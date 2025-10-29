import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";

import Stripe from "stripe";

const stripeSecret = defineSecret("STRIPE_SECRET");

export interface StripePaymentArgs {
  marketCode: string;
  stall: string;
  bookings: string[];
}

export const stripePaymentFunction = (domain: string) =>
  onCall<StripePaymentArgs>(
    {
      secrets: ["STRIPE_SECRET"],
    },
    async (req) => {
      const stripe = new Stripe(stripeSecret.value());
      initializeApp();

      // parameters
      const marketCode = req.data.marketCode;
      const stall = req.data.stall;
      const bookings = req.data.bookings;

      try {
        if (!marketCode || !stall) {
          throw new HttpsError("invalid-argument", "Missing Parameters");
        }

        // get stripe secret from firestore
        const firestore = getFirestore();
        const marketDoc = await firestore
          .collection("markets")
          .doc(marketCode)
          .get();
        const stripeAccount = marketDoc.data()?.stripeAccount;
        if (!stripeAccount) {
          throw new HttpsError(
            "failed-precondition",
            "Market not configured for payments",
          );
        }

        const stallStatusDoc = await firestore
          .collection("stall-statuses")
          .doc(`${marketCode}-${stall}`)
          .get();
        const stallStatus = stallStatusDoc.data();
        if (stallStatus?.status != "approved") {
          throw new HttpsError("failed-precondition", "Stall not Approved");
        }
        if (!stallStatus?.bookingCost) {
          throw new HttpsError("invalid-argument", "No payment required");
        }

        // make stripe object and create checkout session
        const session = await stripe.checkout.sessions.create(
          {
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${domain}/${marketCode}/stall/${stall}/stripe-success`,
            cancel_url: `${domain}/${marketCode}/stall/${stall}/stripe-cancel`,
            line_items: bookings.map((date) => ({
              price_data: {
                currency: "aud",
                product_data: {
                  name: `Market Booking ${date}`,
                },
                unit_amount: stallStatus.bookingCost * 100, // cents
              },
              quantity: 1,
            })),
          },
          {
            stripeAccount,
          },
        );

        await firestore.collection("stripe-payments").doc(session.id).set({
          status: "pending",
          type: "booking",
          marketCode,
          stallId: stall,
          bookings,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        });

        return { sessionId: session.id, url: session.url };
      } catch (e) {
        throw new HttpsError("unknown", `${e}`);
      }
    },
  );
