import type { Market } from "@/types";
import {
  getDocs,
  query,
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import { data, marketCollection } from "./firebase";

export const getMarket = async (
  marketCode: string,
): Promise<Market | undefined> => {
  const ret = await getDoc(doc(collection(data, marketCollection), marketCode));
  return ret.data() as Market;
};

export const listMarkets = async (): Promise<Market[]> => {
  const querySnapshot = await getDocs(
    query(collection(data, marketCollection)),
  );
  const ret: Market[] = [];
  querySnapshot.forEach((doc) => {
    ret.push(doc.data() as Market);
  });
  // console.debug("Markets", ret);
  return ret;
};

export const createMarket = async (
  marketCode: string,
  market: Omit<Market, "code" | "created" | "updated">,
) => {
  await setDoc(doc(collection(data, marketCollection), marketCode), {
    created: new Date().toISOString(),
    code: market,
    ...market,
    updated: new Date().toISOString(),
  });
  return market;
};

export const updateMarket = async (
  marketCode: string,
  market: Partial<Omit<Market, "code" | "created" | "updated">>,
) => {
  await updateDoc(doc(collection(data, marketCollection), marketCode), {
    ...market,
    updated: new Date().toISOString(),
  });
  return getMarket(marketCode);
};
