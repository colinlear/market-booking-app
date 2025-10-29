import { onRequest } from "firebase-functions/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { info, error, warn } from "firebase-functions/logger";
import Stripe from "stripe";

const stripeSecret = defineSecret("STRIPE_SECRET");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

export const stripeCallbackFunction = onRequest(
  {
    secrets: ["STRIPE_SECRET", "STRIPE_WEBHOOK_SECRET"],
  },
  async (req, res) => {
    initializeApp();
    const stripe = new Stripe(stripeSecret.value());
    const webHookSecret = stripeWebhookSecret.value();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"]?.toString() ?? "",
        webHookSecret,
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      res.sendStatus(400);
      return;
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const sessionId = session.id;

        if (!sessionId?.trim()) {
          res.status(400).send({ error: "Missing payment session id" });
          return;
        }
        const firestore = getFirestore();
        const paymentDoc = await firestore
          .collection("stripe-payments")
          .doc(sessionId)
          .get();

        const payment = paymentDoc.data();

        if (!payment) {
          res.status(400).send({ error: "Invalid payment session id" });
          return;
        }

        res.status(200).send();

        const marketCode = payment.marketCode;
        const stallId = payment.stallId;
        const bookings = payment.bookings;

        // set status as paid
        await firestore.collection("stripe-payments").doc(sessionId).update({
          status: "paid",
          paymentId: session.invoice,
          updated: new Date().toISOString(),
        });

        const stall = (
          await firestore.collection("stalls").doc(stallId).get()
        ).data();

        if (!stall) {
          error("Stall not found", payment);
          res.status(500).send({ error: `Stall not found ${stallId}` });
          return;
        }

        // set bookings as paid...
        for (const booking of bookings) {
          const bk = (
            await firestore
              .collection("bookings")
              .doc(`${marketCode}-${stallId}-${booking}`)
              .get()
          ).data();

          if (bk) {
            info("Paid Booking", `${marketCode}-${stallId}-${booking}`);
            await firestore
              .collection("bookings")
              .doc(`${marketCode}-${stallId}-${booking}`)
              .update({
                status: bk?.status == "booked" ? "booked" : "credited",
                isPaid: true,
                paymentId: session.invoice,
                updated: new Date().toISOString(),
              });
          } else {
            warn("Creating a credited booking", {
              marketCode,
              stallId,
              booking,
            });
            // create a credit
            await firestore
              .collection("bookings")
              .doc(`${marketCode}-${stallId}-${booking}`)
              .set({
                marketCode,
                stall,
                date: booking,
                cost: 0,
                status: "credited",
                isPaid: true,
                paymentId: session.invoice,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
              });
          }
        }
        return;
      }

      res.status(200);
    } catch (e) {
      res.status(500).send({ error: e });
    }
  },
);
