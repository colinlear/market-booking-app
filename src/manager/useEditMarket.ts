import { updateMarket } from "@/firebase/market";
import type { Market } from "@/types";
import { useCallback, useState } from "react";

export const useEditMarket = (onDone: (market: Market) => void) => {
  const [loading, setLoading] = useState(false);

  const editMarket = useCallback(
    async (
      marketCode: string,
      edits: Partial<Omit<Market, "code" | "created" | "updated">>,
    ) => {
      setLoading(true);
      try {
        const updated = await updateMarket(marketCode, edits);
        if (updated) {
          onDone(updated);
        }
      } finally {
        setLoading(false);
      }
    },
    [onDone],
  );

  return { editMarket, loading };
};
