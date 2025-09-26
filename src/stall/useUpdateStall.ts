import { useCallback, useState } from "react";
import { updateStall } from "@/firebase/stall";
import type { Stall, StallParams } from "../types";

export const useUpdateStall = (stallId: string, cb: (stall: Stall) => void) => {
  const [loading, setLoading] = useState(false);
  const editStall = useCallback(
    async (stall: Partial<StallParams>) => {
      setLoading(true);
      try {
        const ret = await updateStall(stallId, stall);
        cb(ret);
      } finally {
        setLoading(false);
      }
    },
    [cb, stallId]
  );

  return { editStall, loading };
};
