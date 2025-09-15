import { setMarket } from "@/firebase/market";
import type { Market } from "@/types";
import { useCallback, useState } from "react";

export const useEditMarket = (onDone: (market: Market) => void) => {
  const [loading, setLoading] = useState(false);

  const editMarket = useCallback(
    async (market: Market) => {
      setLoading(true);
      try {
        await setMarket(market);
        onDone(market);
      } finally {
        setLoading(false);
      }
    },
    [onDone]
  );

  return { editMarket, loading };
};
