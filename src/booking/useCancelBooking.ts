import { useCallback, useState } from "react";
import { cancelBooking as cancel } from "../firebase";
import type { Booking } from "../types";
import { today } from "@/common/dates";

export const useCancelBooking = (cb: (booking: Booking) => void) => {
  const [loading, setLoading] = useState(false);

  const cancelBooking = useCallback(
    async (booking: Booking) => {
      setLoading(true);
      try {
        const refund = booking.date > today() && booking.isPaid;
        await cancel(booking, refund);
        cb(booking);
      } finally {
        setLoading(false);
      }
    },
    [cb]
  );

  return { cancelBooking, loading };
};
