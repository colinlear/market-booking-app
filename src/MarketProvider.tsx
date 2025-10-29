import { MarketContext, useGetMarket } from "@/MarketContext";
import { type FC, type PropsWithChildren } from "react";
import { LoadingPage } from "./common/loading";
import { NotFound } from "./common/notfound";

export const MarketProvider: FC<
  { marketCode?: string } & PropsWithChildren
> = ({ marketCode, children }) => {
  const { market, loading, reload } = useGetMarket(marketCode);

  if (!market) {
    if (loading) {
      return <LoadingPage />;
    }
    return <NotFound />;
  }

  return <MarketContext value={{ market, reload }}>{children}</MarketContext>;
};
