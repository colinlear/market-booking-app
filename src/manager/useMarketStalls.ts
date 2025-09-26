import { getStalls } from "@/firebase/stall";
import { listMarketStallStatuses } from "@/firebase/stall-status";
import { useMarket } from "@/MarketContext";
import type { Stall, StallStatus } from "@/types";
import { useCallback, useEffect, useState } from "react";

export interface StallWithStatus extends Stall {
  status: StallStatus;
}

export const useMarketStalls = () => {
  const market = useMarket();
  const [loading, setLoading] = useState(true);
  const [stalls, setStalls] = useState<StallWithStatus[]>();

  const reloadStalls = useCallback(async () => {
    setLoading(true);
    try {
      const statuses = await listMarketStallStatuses(market.code);
      const stallIds = statuses.map((s) => s.stallId);
      const stalls = await getStalls(stallIds);
      const stallIdx: Record<string, Stall> = {};
      for (const s of stalls) {
        stallIdx[s.id] = s;
      }
      const ret: StallWithStatus[] = [];
      for (const s of statuses) {
        if (stallIdx[s.stallId]) {
          ret.push({
            ...stallIdx[s.stallId],
            status: s,
          });
        }
      }
      ret.sort((a, b) => a.name.localeCompare(b.name));

      setStalls(ret);
    } finally {
      setLoading(false);
    }
  }, [market]);

  useEffect(() => {
    reloadStalls();
  }, [reloadStalls]);

  return { stalls, loading, reloadStalls };
};
