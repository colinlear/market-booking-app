import { useCallback, useEffect, useState } from "react";
import type { Stall } from "../types";
import { getStall } from "../firebase";

export const useStall = (stallId?: string) => {
  const [loading, setLoading] = useState(true);
  const [stall, setStall] = useState<Stall>();

  const reloadStall = useCallback(() => {
    if (stallId) {
      setLoading(true);
      getStall(stallId)
        .then((ret) => {
          setStall(ret);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [stallId]);

  useEffect(() => reloadStall, [reloadStall]);

  return { stall, loading, reload: reloadStall };
};
