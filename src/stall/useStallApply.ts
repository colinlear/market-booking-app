import { applyStallStatus, updateStallStatus } from "@/firebase/stall-status";
import { useMarket } from "@/MarketContext";
import type { Stall, StallStatus } from "@/types";
import { useCallback, useState } from "react";

export const useStallApply = (stall: Stall, cb: () => void) => {
  const market = useMarket();
  const [loading, setLoading] = useState(false);
  const applyToMarket = useCallback(
    async (requiresPower: boolean, requiresTent: number) => {
      setLoading(true);
      try {
        await applyStallStatus({
          marketCode: market.code,
          stallId: stall.id,
          requiresPower,
          requiresTent,
        });

        cb();
      } finally {
        setLoading(false);
      }
    },
    [cb, stall, market],
  );

  return { applyToMarket, loading };
};

export const useSetStallStatus = (
  defaultStatus: StallStatus,
  cb: () => void,
) => {
  const [loading, setLoading] = useState(false);
  const setStallStatus = useCallback(
    async ({
      status,
      bookingCost,
    }: Pick<StallStatus, "status" | "bookingCost">) => {
      setLoading(true);
      try {
        await updateStallStatus(
          defaultStatus.marketCode,
          defaultStatus.stallId,
          {
            status,
            bookingCost,
          },
        );

        cb();
      } finally {
        setLoading(false);
      }
    },
    [defaultStatus, cb],
  );

  return { setStallStatus, loading };
};
