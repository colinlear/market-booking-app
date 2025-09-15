import { MarketContext, useListMarkets } from "@/MarketContext";
import { useMemo, type FC, type PropsWithChildren } from "react";
import { LoadingPage } from "./common/loading";
import { NotFound } from "./common/notfound";

export const MarketProvider: FC<
  { marketCode?: string } & PropsWithChildren
> = ({ marketCode, children }) => {
  const { markets, loading, reload } = useListMarkets();

  const market = useMemo(() => {
    return marketCode ? markets?.[marketCode] : undefined;
  }, [markets, marketCode]);

  if (!market || !markets) {
    if (loading) {
      return <LoadingPage />;
    }
    return <NotFound />;
  }

  return (
    <MarketContext value={{ market, markets, reload }}>
      {children}
    </MarketContext>
  );
};
