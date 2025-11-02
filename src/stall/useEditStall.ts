import { useCallback, useState } from "react";
import { updateStall } from "@/firebase/stall";
import type { Stall, StallParams, StallStatus } from "../types";
import { updateStallStatus } from "@/firebase/stall-status";

export const useEditStall = (
  defaultStall: Stall | undefined,
  cb: (stall: Stall) => void
) => {
  const [loading, setLoading] = useState(false);
  const editStall = useCallback(
    async (stall: StallParams, status?: StallStatus) => {
      if (!defaultStall) return;
      setLoading(true);
      try {
        const ret = await updateStall(defaultStall.id, stall);
        if (status) {
          updateStallStatus(status.marketCode, status.stallId, {
            requiresPower: status.requiresPower,
            requiresTent: status.requiresTent,
          });
        }
        cb(ret);
      } finally {
        setLoading(false);
      }
    },
    [cb, defaultStall]
  );

  return { editStall, loading };
};
