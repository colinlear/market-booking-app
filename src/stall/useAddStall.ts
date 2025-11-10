import { useCallback, useState } from "react";
import { createStall } from "@/firebase/stall";
import { applyStallStatus } from "@/firebase/stall-status";
import type { Stall, StallParams } from "../types";
import { useMarket } from "@/MarketContext";

export const useAddStall = (cb: (stall: Stall) => void) => {
  const market = useMarket();
  const [stall, setStall] = useState<Stall>();
  const [loading, setLoading] = useState(false);
  const addStall = useCallback(
    async (
      stall: StallParams,
      requiresPower: boolean,
      requiresTent: number,
      size: string,
      notes: string
    ) => {
      setStall(undefined);
      setLoading(true);
      try {
        const ret = await createStall({
          ...stall,
          marketCode: market.code,
        });
        if (ret) {
          await applyStallStatus({
            marketCode: market.code,
            stallId: ret.id,
            requiresPower,
            requiresTent,
            size,
            notes,
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
    [cb, market]
  );

  return { stall, addStall, loading };
};
