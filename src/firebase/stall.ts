import type { Stall, StallParams } from "@/types";
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
  addDoc,
  setDoc,
} from "@firebase/firestore";
import { data, stallCollection, auth } from "./firebase";

export const listStalls = async () => {
  const querySnapshot = await getDocs(
    query(
      collection(data, stallCollection),
      where("email", "==", auth.currentUser?.email)
    )
  );
  const ret: Stall[] = [];
  console.debug("Query", querySnapshot);
  querySnapshot.forEach((doc) => {
    ret.push({
      id: doc.id,
      ...doc.data(),
    } as Stall);
  });
  console.debug("Stalls", ret);
  return ret;
};

export const getStalls = async (stallIds: string[]) => {
  const querySnapshot = await getDocs(
    query(collection(data, stallCollection), where("__name__", "in", stallIds))
  );
  const ret: Stall[] = [];
  console.debug("Query", querySnapshot);
  querySnapshot.forEach((doc) => {
    ret.push({
      id: doc.id,
      ...doc.data(),
    } as Stall);
  });
  console.debug("Stalls", ret);
  return ret;
};

export const getStall = async (stallId: string) => {
  const docSnapshot = await getDoc(
    doc(collection(data, stallCollection), stallId)
  );
  console.debug("GetDoc", docSnapshot);
  return {
    id: docSnapshot.id,
    ...docSnapshot.data(),
  } as Stall;
};

export const createStall = async (stall: StallParams): Promise<Stall> => {
  const entry = {
    ...stall,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
  const ref = await addDoc(collection(data, stallCollection), entry);
  return {
    id: ref.id,
    ...entry,
  };
};

export const editStall = async ({ id, ...stall }: Stall): Promise<Stall> => {
  await setDoc(doc(collection(data, stallCollection), id), {
    ...stall,
    updated: new Date().toISOString(),
  });
  return {
    id,
    ...stall,
    updated: new Date().toISOString(),
  };
};
