import { useCallback, useEffect, useState } from "react";
import type { Stall } from "../types";
import { listStalls } from "../firebase";

export const useStallList = () => {
  const [loading, setLoading] = useState(true);
  const [stalls, setStalls] = useState<Stall[]>();

  const reloadStalls = useCallback(() => {
    setLoading(true);
    listStalls()
      .then((ret) => {
        setStalls(ret);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => reloadStalls, [reloadStalls]);

  return { stalls, loading, reload: reloadStalls };
};
