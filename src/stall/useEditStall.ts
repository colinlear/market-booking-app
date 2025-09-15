import { useCallback, useState } from "react";
import { editStall as doEditStall } from "@/firebase/stall";
import type { Stall, StallParams } from "../types";

export const useEditStall = (
  defaultStall: Stall | undefined,
  cb: (stall: Stall) => void
) => {
  const [loading, setLoading] = useState(false);
  const editStall = useCallback(
    async (stall: StallParams) => {
      if (!defaultStall) return;
      setLoading(true);
      try {
        const ret = await doEditStall({
          ...defaultStall,
          ...stall,
        });
        cb(ret);
      } finally {
        setLoading(false);
      }
    },
    [cb, defaultStall]
  );

  return { editStall, loading };
};
