import { listMarketBookings } from "@/firebase/booking";
import { useMarket } from "@/MarketContext";
import type { Booking } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useMarketBookings = (date?: string) => {
  const market = useMarket();
  const [bookings, setBookings] = useState<Booking[]>();
  const [loading, setLoading] = useState(true);

  const reloadBookings = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const ret = await listMarketBookings(market.code, date);
      // sort by booked/cancelled and name
      ret.sort((a, b) =>
        a.status == b.status
          ? a.stall.name.localeCompare(b.stall.name)
          : a.status == "booked"
          ? -1
          : 1
      );
      setBookings(ret);
    } finally {
      setLoading(false);
    }
  }, [market, date]);

  useEffect(() => {
    reloadBookings();
  }, [reloadBookings]);

  return { bookings, loading, reloadBookings };
};
