import type { StallStatus, StallStatusParams } from "@/types";
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
  setDoc,
} from "@firebase/firestore";
import { data, stallStatusCollection, auth } from "./firebase";

export const listMarketStallStatuses = async (marketCode: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(data, stallStatusCollection),
      where("marketCode", "==", marketCode)
    )
  );
  const ret: StallStatus[] = [];
  console.debug("Query", querySnapshot);
  querySnapshot.forEach((doc) => {
    ret.push({
      id: doc.id,
      ...doc.data(),
    } as StallStatus);
  });
  console.debug("MarketStatus", ret);
  return ret;
};

export const listStallStatuses = async () => {
  const querySnapshot = await getDocs(
    query(
      collection(data, stallStatusCollection),
      where("uid", "==", auth.currentUser?.uid)
    )
  );
  const ret: StallStatus[] = [];
  console.debug("Query", querySnapshot);
  querySnapshot.forEach((doc) => {
    ret.push({
      id: doc.id,
      ...doc.data(),
    } as StallStatus);
  });
  console.debug("MarketStatus", ret);
  return ret;
};

export const getStallStatus = async (market: string, stallId: string) => {
  const querySnapshot = await getDoc(
    doc(collection(data, stallStatusCollection), `${market}-${stallId}`)
  );
  const ret = querySnapshot.data();
  console.debug("Stall Status", market, stallId, ret);
  return ret as StallStatus;
};

export const applyStallStatus = async (
  status: StallStatusParams
): Promise<StallStatus> => {
  const record: Omit<StallStatus, "id"> = {
    ...status,
    status: "pending",
    bookingCost: 0,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  await setDoc(
    doc(
      collection(data, stallStatusCollection),
      `${status.marketCode}-${status.stallId}`
    ),
    { ...record, uid: auth.currentUser?.uid }
  );
  return {
    id: `${status.marketCode}-${status.stallId}`,
    ...record,
  };
};

export const updateStallStatus = async (
  status: StallStatus
): Promise<StallStatus> => {
  const record: Omit<StallStatus, "id"> = {
    ...status,
    updated: new Date().toISOString(),
  };
  await setDoc(
    doc(
      collection(data, stallStatusCollection),
      `${status.marketCode}-${status.stallId}`
    ),
    { ...record, uid: auth.currentUser?.uid }
  );
  return {
    id: `${status.marketCode}-${status.stallId}`,
    ...record,
  };
};
