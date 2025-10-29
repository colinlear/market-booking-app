import { useMarket } from "@/MarketContext";
import { format } from "date-fns/format";

export const useMarketDates = () => {
  const yesterday = format(new Date(), "yyyy-MM-dd");
  return useMarket().dates?.filter((b) => b >= yesterday) ?? [];
};
