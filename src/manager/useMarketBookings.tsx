import { listMarketBookings } from "@/firebase/booking";
import { getStalls } from "@/firebase/stall";
import { getMarketStallStatuses } from "@/firebase/stall-status";
import { useMarket } from "@/MarketContext";
import type { BookingWithStall, Stall } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useMarketBookings = (date?: string) => {
  const market = useMarket();
  const [bookings, setBookings] = useState<BookingWithStall[]>();
  const [loading, setLoading] = useState(true);

  const reloadBookings = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const bookings = await listMarketBookings(market.code, date);
      const stallIds = bookings.map((s) => s.stall.id);
      const stalls = await getStalls(stallIds);
      const stallStatuses = await getMarketStallStatuses(market.code, stallIds);
      const stallIdx: Record<string, Stall> = {};
      for (const s of stalls) {
        stallIdx[s.id] = s;
      }
      const ret: BookingWithStall[] = [];
      for (const b of bookings) {
        ret.push({
          ...b,
          stall: stallIdx[b.stall.id] ?? b.stall,
          stallStatus: stallStatuses[b.stall.id],
        });
      }
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
