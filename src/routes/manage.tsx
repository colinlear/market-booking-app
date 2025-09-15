import type { FC } from "react";
import { MarketForm } from "@/manager/MarketForm";
import { useIsMarketAdmin, useMarket } from "@/MarketContext";

export const ManageRoute: FC = () => {
  const market = useMarket();
  const isAdmin = useIsMarketAdmin();
  if (!isAdmin) return "Access Denied";
  return <MarketForm market={market} onSave={() => location.reload()} />;
};
