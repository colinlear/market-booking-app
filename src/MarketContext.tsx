import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, listMarkets } from "./firebase";
import type { Market } from "./types";

export interface MarketContextProps {
  market: Market;
  markets: Record<string, Market>;
  reload: () => void;
}

export const MarketContext = createContext<MarketContextProps>(
  {} as MarketContextProps
);

export const useMarket = () =>
  useContext<MarketContextProps>(MarketContext).market;

export const useReloadMarket = () =>
  useContext<MarketContextProps>(MarketContext).reload;

export const useMarketList = () =>
  useContext<MarketContextProps>(MarketContext).markets;

export const useIsMarketAdmin = () => {
  const market = useMarket();
  return (
    !!auth.currentUser?.email && market.admins.includes(auth.currentUser?.email)
  );
};

export const useListMarkets = () => {
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState<Record<string, Market>>();

  const reloadMarkets = useCallback(() => {
    setLoading(true);
    listMarkets()
      .then((ret) => {
        const list: Record<string, Market> = {};
        for (const m of ret) {
          list[m.code] = m;
        }
        setMarkets(list);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => reloadMarkets, [reloadMarkets]);

  return { markets, loading, reload: reloadMarkets };
};
