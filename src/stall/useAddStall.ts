import { useCallback, useState } from "react";
import { applyStallStatus, createStall } from "../firebase";
import type { Stall, StallParams } from "../types";
import { useMarket } from "@/MarketContext";

export const useAddStall = (cb: (stall: Stall) => void) => {
  const market = useMarket();
  const [stall, setStall] = useState<Stall>();
  const [loading, setLoading] = useState(false);
  const addStall = useCallback(
    async (stall: StallParams) => {
      setStall(undefined);
      setLoading(true);
      try {
        const ret = await createStall(stall);
        if (ret) {
          await applyStallStatus({
            marketCode: market.code,
            stallId: ret.id,
          });
          setStall(ret);
          cb(ret);
        }
      } finally {
        setLoading(false);
      }
    },
    [cb, market]
  );

  return { stall, addStall, loading };
};
