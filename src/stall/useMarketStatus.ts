import { useCallback, useEffect, useState } from "react";
import type { StallStatus } from "../types";
import { getStallStatus } from "@/firebase/stall-status";
import { useMarket } from "@/MarketContext";

export const useStallStatus = (stallId: string) => {
  const market = useMarket();
  const [loading, setLoading] = useState(true);
  const [stallStatus, setStallStatus] = useState<StallStatus>();

  const reloadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const ret = await getStallStatus(market.code, stallId);
      setStallStatus(ret);
    } finally {
      setLoading(false);
    }
  }, [market, stallId]);

  useEffect(() => {
    reloadStatus();
  }, [reloadStatus]);

  return { stallStatus, loading, reload: reloadStatus };
};
