import { useCallback, useEffect, useState } from "react";
import type { Stall } from "../types";
import { getStall } from "@/firebase/stall";

export const useStall = (stallId?: string) => {
  const [loading, setLoading] = useState(true);
  const [stall, setStall] = useState<Stall>();

  const reloadStall = useCallback(async () => {
    if (stallId) {
      setLoading(true);
      try {
        const ret = await getStall(stallId);
        setStall(ret);
      } catch (e) {
        console.error("Get Stall Error", e);
      } finally {
        setLoading(false);
      }
    }
  }, [stallId]);

  useEffect(() => {
    reloadStall();
  }, [reloadStall]);

  return { stall, loading, reload: reloadStall };
};
