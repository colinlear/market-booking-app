import { payBookingWithCredit } from "@/firebase/booking";
import { stripeCheckout } from "@/stripe";
import type { Booking, Market, Stall } from "@/types";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

export const useCheckout = (market: Market, stall: Stall) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const checkout = useCallback(
    async (bookings: Booking[], credits: Booking[]) => {
      if (!stall) return;
      setLoading(true);
      try {
        const creds = [...credits];
        const books = [...bookings];
        while (creds.length && books.length) {
          const credit = creds[0];
          const book = books[0];
          if (credit && book) {
            await payBookingWithCredit(credit, book);
            creds.shift();
            books.shift();
          } else {
            break;
          }
        }
        if (books.length > 0) {
          const stripeSession = await stripeCheckout(
            market.code,
            stall.id,
            books.map((b) => b.date),
          );
          if (stripeSession?.url) {
            window.location.href = stripeSession.url;
          } else {
            alert("Connection Failed: Please try again later");
          }
        } else {
          navigate("../");
        }
      } catch (e) {
        console.error("Checkout Error", e);
      } finally {
        setLoading(false);
      }
    },
    [market, stall, navigate],
  );

  return { checkout, loading };
};
