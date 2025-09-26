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
  updateDoc,
} from "@firebase/firestore";
import { data, stallCollection, auth } from "./firebase";

export const listStalls = async () => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(data, stallCollection),
        where("email", "==", auth.currentUser?.email)
      )
    );
    const ret: Stall[] = [];
    querySnapshot.forEach((doc) => {
      ret.push({
        id: doc.id,
        ...doc.data(),
      } as Stall);
    });
    // console.debug("Stalls", ret);
    return ret;
  } catch (e) {
    console.error("ListStalls Error:", e);
    return [];
  }
};

export const getStalls = async (stallIds: string[]) => {
  const querySnapshot = await getDocs(
    query(collection(data, stallCollection), where("__name__", "in", stallIds))
  );
  const ret: Stall[] = [];
  querySnapshot.forEach((doc) => {
    ret.push({
      id: doc.id,
      ...doc.data(),
    } as Stall);
  });
  // console.debug("Stalls", ret);
  return ret;
};

export const getStall = async (stallId: string) => {
  const docSnapshot = await getDoc(
    doc(collection(data, stallCollection), stallId)
  );
  const ret = {
    id: docSnapshot.id,
    ...docSnapshot.data(),
  } as Stall;
  // console.debug("Stall", ret);
  return ret;
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

export const updateStall = async (
  id: string,
  update: Partial<Stall>
): Promise<Stall> => {
  await updateDoc(doc(collection(data, stallCollection), id), {
    ...update,
    updated: new Date().toISOString(),
  });
  return getStall(id);
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
