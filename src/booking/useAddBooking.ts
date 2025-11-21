import { useCallback, useState } from "react";
import {
  createBooking,
  listMarketBookings,
  updateBooking,
} from "@/firebase/booking";
import type { Booking, Market, Stall, StallStatus } from "../types";
import { useMarket } from "@/MarketContext";

const checkProductQuotas = async (
  market: Market,
  date: string,
  products: string[]
): Promise<string[]> => {
  const ret: string[] = [];
  const bookings = (await listMarketBookings(market.code, date)).filter(
    (b) => b.status == "booked"
  );
  const quotas: Record<string, number> = {};
  if (!market.productQuotas) return ret;
  for (const prod of products) {
    const p = prod.toLocaleLowerCase();
    if (market.productQuotas[p] == 0) {
      ret.push(`Selling '${p}' is not allowed`);
    } else if (market.productQuotas[p] != null) {
      for (const b of bookings) {
        if (b.stall.products?.includes(p)) {
          quotas[p] = (quotas[p] ?? 0) + 1;
        }
      }
    }
  }
  for (const p of Object.keys(quotas)) {
    if (quotas[p] >= market.productQuotas[p]) {
      ret.push(
        `Already ${quotas[p]} stall${quotas[p] > 1 ? "s" : ""} selling '${p}'`
      );
    }
  }
  return ret;
};

export const useAddBooking = (cb: (booking: Booking) => void) => {
  const market = useMarket();
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState(false);
  const [requiresConfirm, setRequiresConfirm] = useState<string[]>([]);

  const cancelAddBooking = useCallback(() => {
    setRequiresConfirm([]);
    setLoading(false);
  }, []);

  const addBooking = useCallback(
    async (
      stall: Stall,
      status: StallStatus,
      date: string,
      checkQuota = true
    ) => {
      setBooking(undefined);
      setLoading(true);
      if (checkQuota) {
        const confirm = await checkProductQuotas(market, date, stall.products);
        if (confirm.length) {
          setRequiresConfirm(confirm);
          setLoading(false);
          return;
        }
      }
      try {
        const ret = await createBooking({
          marketCode: market.code,
          status: "booked",
          stall: {
            id: stall.id,
            name: stall.name,
            description: stall.description,
            products: stall.products,
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
        setRequiresConfirm([]);
        setLoading(false);
      }
    },
    [cb, market]
  );

  return { booking, addBooking, requiresConfirm, cancelAddBooking, loading };
};

export const useRebook = (
  stall: Stall,
  status: StallStatus | undefined,
  booking: Booking | undefined,
  cb: (booking?: Booking) => void
) => {
  const market = useMarket();
  const [loading, setLoading] = useState(false);
  const [requiresConfirmRebook, setRequiresConfirm] = useState<string[]>([]);

  const cancelRebook = useCallback(() => {
    setRequiresConfirm([]);
    setLoading(false);
  }, []);

  const rebook = useCallback(
    async (checkQuota = true) => {
      if (!booking) return;

      setLoading(true);
      if (checkQuota) {
        const confirm = await checkProductQuotas(
          market,
          booking.date,
          stall.products
        );
        if (confirm.length) {
          setRequiresConfirm(confirm);
          setLoading(false);
          return;
        }
      }
      try {
        await updateBooking(booking.id, {
          status: "booked",
          stall: {
            id: stall.id,
            name: stall.name,
            description: stall.description,
            products: stall.products,
          },
          cost: status?.bookingCost ?? booking.cost,
          isPaid: booking.status == "credited",
        });
        if (cb) {
          cb({
            ...booking,
            status: "booked",
            stall: {
              id: stall.id,
              name: stall.name,
              description: stall.description,
              products: stall.products,
            },
            cost: status?.bookingCost ?? booking.cost,
            isPaid: booking.status == "credited",
            updated: new Date().toISOString(),
          });
        }
      } finally {
        setRequiresConfirm([]);
        setLoading(false);
      }
    },
    [cb, market, stall, status, booking]
  );

  return {
    booking,
    rebook,
    requiresConfirmRebook,
    cancelRebook,
    loading,
  };
};
