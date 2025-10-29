import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "./firebase/firebase";
import { getMarket, listMarkets } from "./firebase/market";
import type { Market } from "./types";

export interface MarketContextProps {
  market: Market;
  reload: () => void;
}

export const MarketContext = createContext<MarketContextProps>(
  {} as MarketContextProps,
);

export const useMarket = () =>
  useContext<MarketContextProps>(MarketContext).market;

export const useReloadMarket = () =>
  useContext<MarketContextProps>(MarketContext).reload;

export const useIsMarketAdmin = () => {
  const market = useMarket();
  return (
    !!auth.currentUser?.email && market.admins.includes(auth.currentUser?.email)
  );
};

export const useGetMarket = (marketCode?: string) => {
  const [loading, setLoading] = useState(true);
  const [market, setMarket] = useState<Market>();

  const reloadMarket = useCallback(async () => {
    if (!marketCode) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const ret = await getMarket(marketCode);
      setMarket(ret);
    } finally {
      setLoading(false);
    }
  }, [marketCode]);

  useEffect(() => {
    reloadMarket();
  }, [reloadMarket]);

  return { market, loading, reload: reloadMarket };
};

export const useListMarkets = () => {
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState<Record<string, Market>>();

  const reloadMarkets = useCallback(async () => {
    setLoading(true);
    try {
      const ret = await listMarkets();
      const list: Record<string, Market> = {};
      for (const m of ret) {
        list[m.code] = m;
      }
      setMarkets(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadMarkets();
  }, [reloadMarkets]);

  return { markets, loading, reload: reloadMarkets };
};
