import { useCallback, useState } from "react";
import { createStall } from "@/firebase/stall";
import { applyStallStatus } from "@/firebase/stall-status";
import type { Stall, StallParams } from "../types";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";

export const useAddStall = (cb: (stall: Stall) => void) => {
  const market = useMarket();
  const isMarketAdmin = useIsMarketAdmin();
  const [stall, setStall] = useState<Stall>();
  const [loading, setLoading] = useState(false);
  const addStall = useCallback(
    async (stall: StallParams) => {
      setStall(undefined);
      setLoading(true);
      try {
        const ret = await createStall({
          ...stall,
          marketCode: isMarketAdmin ? market.code : undefined,
        });
        if (ret) {
          await applyStallStatus({
            marketCode: market.code,
            stallId: ret.id,
          });
          setStall(ret);
          cb(ret);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [cb, market, isMarketAdmin]
  );

  return { stall, addStall, loading };
};
