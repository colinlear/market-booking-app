import type { Booking, BookingParams } from "@/types";
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
  setDoc,
  runTransaction,
} from "@firebase/firestore";
import { data, bookingCollection, auth } from "./firebase";

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

export const payBooking = async (
  booking: Booking,
  paid: number,
  paymentId: string
) => {
  await runTransaction(data, async (transaction) => {
    transaction.update(doc(collection(data, bookingCollection), booking.id), {
      isPaid: true,
      cost: paid,
      paymentId,
    });
  });
};
