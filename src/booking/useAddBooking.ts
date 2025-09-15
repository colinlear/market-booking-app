import { useCallback, useState } from "react";
import { createBooking } from "../firebase";
import type { Booking, Stall } from "../types";
import { useMarket } from "@/MarketContext";

export const useAddBooking = (cb: (booking: Booking) => void) => {
  const market = useMarket();
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState(false);

  const addBooking = useCallback(
    async (stall: Stall, date: string) => {
      setBooking(undefined);
      setLoading(true);
      try {
        const ret = await createBooking({
          marketCode: market.code,
          status: "booked",
          stall,
          date,
          isPaid: false,
        });
        if (ret) {
          cb(ret);
          setBooking(ret);
        }
      } finally {
        setLoading(false);
      }
    },
    [cb, market]
  );

  return { booking, addBooking, loading };
};

export const useRebook = (
  booking: Booking | undefined,
  cb: (booking?: Booking) => void
) => {
  const [loading, setLoading] = useState(false);

  const rebook = useCallback(async () => {
    if (!booking) return;
    setLoading(true);
    try {
      const ret = await createBooking({
        marketCode: booking.marketCode,
        status: "booked",
        stall: booking.stall,
        date: booking.date,
        isPaid: booking.status == "credited",
      });
      if (ret) {
        cb(ret);
      }
    } finally {
      setLoading(false);
    }
  }, [cb, booking]);

  return { booking, rebook, loading };
};
