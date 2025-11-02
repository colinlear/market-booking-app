import { useCallback, useState } from "react";
import { createBooking, updateBooking } from "@/firebase/booking";
import type { Booking, Stall, StallStatus } from "../types";
import { useMarket } from "@/MarketContext";

export const useAddBooking = (cb: (booking: Booking) => void) => {
  const market = useMarket();
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState(false);

  const addBooking = useCallback(
    async (stall: Stall, status: StallStatus, date: string) => {
      setBooking(undefined);
      setLoading(true);
      try {
        const ret = await createBooking({
          marketCode: market.code,
          status: "booked",
          stall: {
            id: stall.id,
            name: stall.name,
          },
          date,
          requiresPower: status.requiresPower,
          requiresTent: status.requiresTent,
          cost: status.bookingCost,
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
    [cb, market],
  );

  return { booking, addBooking, loading };
};

export const useRebook = (
  booking: Booking | undefined,
  cb: (booking?: Booking) => void,
) => {
  const [loading, setLoading] = useState(false);

  const rebook = useCallback(async () => {
    if (!booking) return;
    setLoading(true);
    try {
      await updateBooking(booking.id, {
        status: "booked",
        isPaid: booking.status == "credited",
      });
      if (cb) {
        cb({
          ...booking,
          status: "booked",
          isPaid: booking.status == "credited",
          updated: new Date().toISOString(),
        });
      }
    } finally {
      setLoading(false);
    }
  }, [cb, booking]);

  return { booking, rebook, loading };
};
