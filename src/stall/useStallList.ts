import { useCallback, useEffect, useState } from "react";
import type { Stall } from "../types";
import { listStalls } from "@/firebase/stall";

export const useStallList = () => {
  const [loading, setLoading] = useState(true);
  const [stalls, setStalls] = useState<Stall[]>();

  const reloadStalls = useCallback(async () => {
    setLoading(true);
    try {
      const ret = await listStalls();
      setStalls(ret);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadStalls();
  }, [reloadStalls]);

  return { stalls, loading, reload: reloadStalls };
};
