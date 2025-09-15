// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  runTransaction,
  setDoc,
  where,
} from "firebase/firestore";
import type {
  Booking,
  StallStatus,
  Stall,
  StallParams,
  BookingParams,
  Market,
  StallStatusParams,
} from "./types";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgUFlLRLqHwxJMAIKlQSNfGTroarOX-1E",
  authDomain: "vicparkfarmersmarket-856a7.firebaseapp.com",
  projectId: "vicparkfarmersmarket-856a7",
  storageBucket: "vicparkfarmersmarket-856a7.firebasestorage.app",
  messagingSenderId: "816559797302",
  appId: "1:816559797302:web:773779d0e4447765889497",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const data = getFirestore(firebaseApp);

const stallStatusCollection = "stall-statuses";
const marketCollection = "markets";
const stallCollection = "stalls";
const bookingCollection = "bookings";

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
  return querySnapshot.data() as StallStatus;
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
export const listStalls = async () => {
  const querySnapshot = await getDocs(
    query(
      collection(data, stallCollection),
      where("uid", "==", auth.currentUser?.uid)
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
  const ref = await addDoc(collection(data, stallCollection), {
    ...stall,
    bookingCost: 0,
    uid: auth.currentUser?.uid,
    email: auth.currentUser?.email,
  });
  return {
    id: ref.id,
    ...stall,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
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

export const listMarketBookings = async (marketCode: string, date: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(data, bookingCollection),
      where("date", "==", date),
      where("marketCode", "==", marketCode)
    )
  );
  const ret: Booking[] = [];
  querySnapshot.forEach((doc) => {
    ret.push({
      id: doc.id,
      ...doc.data(),
    } as Booking);
  });
  console.debug("Bookings", ret);
  ret.sort((a, b) => a.date.localeCompare(b.date));
  return ret;
};

export const listBookings = async (marketCode: string, stallId: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(data, bookingCollection),
      where("stall.id", "==", stallId),
      where("marketCode", "==", marketCode)
    )
  );
  const ret: Booking[] = [];
  querySnapshot.forEach((doc) => {
    ret.push({
      id: doc.id,
      ...doc.data(),
    } as Booking);
  });
  ret.sort((a, b) => a.date.localeCompare(b.date));
  return ret;
};

export const getBooking = async (
  marketCode: string,
  stallId: string,
  date: string
) => {
  const bookingSnap = await getDoc(
    doc(collection(data, bookingCollection), `${marketCode}-${stallId}-${date}`)
  );
  if (!bookingSnap.exists()) return undefined;
  return {
    id: bookingSnap.id,
    ...bookingSnap.data(),
  } as Booking;
};

export const createBooking = async (booking: BookingParams) => {
  const ref = await setDoc(
    doc(
      collection(data, bookingCollection),
      `${booking.marketCode}-${booking.stall.id}-${booking.date}`
    ),
    {
      ...booking,
      uid: auth.currentUser?.uid,
    }
  );
  console.debug(ref);
  return {
    id: `${booking.marketCode}-${booking.stall.id}-${booking.date}`,
    ...booking,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  };
};

export const cancelBooking = async (booking: Booking, refund = false) => {
  await runTransaction(data, async (transaction) => {
    transaction.update(doc(collection(data, bookingCollection), booking.id), {
      status: refund ? "credited" : "cancelled",
    });
  });
};
