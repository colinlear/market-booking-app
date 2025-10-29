import { useCallback, useEffect, useState } from "react";
import { listBookings } from "@/firebase/booking";
import type { Booking } from "../types";
import { format } from "date-fns/format";
import { useMarket } from "@/MarketContext";

export const useBookingList = (stallId: string, future = true) => {
  const market = useMarket();
  const [bookings, setBooking] = useState<Booking[]>();
  const [creditedBookings, setCreditedBookings] = useState<Booking[]>([]);
  const [unpaidBookings, setUnpaidBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const reloadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const ret = await listBookings(market.code, stallId);
      if (ret) {
        const credits: Booking[] = [];
        const unpaid: Booking[] = [];
        for (const b of ret) {
          if (b.status == "credited") {
            credits.push(b);
          }
          if (b.status === "booked" && !b.isPaid && b.cost > 0) {
            unpaid.push(b);
          }
        }
        setCreditedBookings(credits);
        setUnpaidBookings(unpaid);
        if (future) {
          const yesterday = format(new Date(), "yyyy-MM-dd");
          setBooking(
            ret.filter((b) => b.date >= yesterday && b.status == "booked"),
          );
        } else {
          setBooking(ret);
        }
      } else {
        setBooking(undefined);
        setCreditedBookings([]);
        setUnpaidBookings([]);
      }
    } finally {
      setLoading(false);
    }
  }, [market.code, stallId, future]);

  useEffect(() => {
    reloadBookings();
  }, [reloadBookings]);

  return {
    bookings,
    creditedBookings,
    unpaidBookings,
    reload: reloadBookings,
    loading,
  };
};
