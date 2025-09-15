import { useCallback, useEffect, useState } from "react";
import { listBookings } from "../firebase";
import type { Booking } from "../types";
import { format } from "date-fns/format";
import { useMarket } from "@/MarketContext";

export const useBookingList = (stallId: string, future = true) => {
  const market = useMarket();
  const [bookings, setBooking] = useState<Booking[]>();
  const [loading, setLoading] = useState(true);

  const reloadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const ret = await listBookings(market.code, stallId);
      if (ret) {
        if (future) {
          const yesterday = format(new Date(), "yyyy-MM-dd");
          setBooking(
            ret.filter((b) => b.date >= yesterday && b.status == "booked")
          );
        } else {
          setBooking(ret);
        }
      } else {
        setBooking(undefined);
      }
    } finally {
      setLoading(false);
    }
  }, [market.code, stallId, future]);

  useEffect(() => {
    reloadBookings();
  }, [reloadBookings]);

  return { bookings, reload: reloadBookings, loading };
};
