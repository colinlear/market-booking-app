import { listMarketBookings } from "@/firebase";
import { useMarket } from "@/MarketContext";
import type { Booking } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useMarketBookings = (date?: string) => {
  const market = useMarket();
  const [stalls, setStalls] = useState<Booking[]>();
  const [loading, setLoading] = useState(true);

  const reloadStalls = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const ret = await listMarketBookings(market.code, date);
      console.debug("Booking List", ret);
      // sort by booked/cancelled and name
      ret.sort((a, b) =>
        a.status == b.status
          ? a.stall.name.localeCompare(b.stall.name)
          : a.status == "booked"
          ? -1
          : 1
      );
      setStalls(ret);
    } finally {
      setLoading(false);
    }
  }, [market, date]);

  useEffect(() => {
    reloadStalls();
  }, [reloadStalls]);

  return { stalls, loading, reloadStalls };
};
