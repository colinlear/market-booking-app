import { useCallback, useEffect, useState } from "react";
import { getBooking as get } from "../firebase";
import type { Booking } from "../types";
import { useMarket } from "@/MarketContext";

export const useBooking = (stallId: string, date: string) => {
  const market = useMarket();
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState(true);

  const getBooking = useCallback(async () => {
    setLoading(true);
    try {
      const ret = await get(market.code, stallId, date);
      if (ret) {
        setBooking(ret);
      } else {
        setBooking(undefined);
      }
    } finally {
      setLoading(false);
    }
  }, [market, stallId, date]);

  useEffect(() => {
    getBooking();
  }, [getBooking]);

  return { booking, reload: getBooking, loading };
};
