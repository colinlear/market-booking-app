import type { Market } from "@/types";
import { getDocs, query, collection, setDoc, doc } from "@firebase/firestore";
import { data, marketCollection } from "./firebase";

// export const getMarket = async (
//   marketCode: string
// ): Promise<Market | undefined> => {
//   const ret = await getDoc(doc(collection(data, marketCollection), marketCode));
//   return ret.data() as Market;
// };

export const listMarkets = async (): Promise<Market[]> => {
  const querySnapshot = await getDocs(
    query(collection(data, marketCollection))
  );
  const ret: Market[] = [];
  console.debug("Query", querySnapshot);
  querySnapshot.forEach((doc) => {
    ret.push(doc.data() as Market);
  });
  console.debug("Markets", ret);
  return ret;
};

export const setMarket = async (market: Market) => {
  await setDoc(doc(collection(data, marketCollection), market.code), {
    created: new Date().toISOString(),
    ...market,
    update: new Date().toISOString(),
  });
  return market;
};
