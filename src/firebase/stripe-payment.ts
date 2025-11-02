import { collection, getDoc, doc } from "@firebase/firestore";
import { data, stripePaymentsCollection } from "./firebase";

export const getStripePayment = async (session: string) => {
  const docSnapshot = await getDoc(
    doc(collection(data, stripePaymentsCollection), session),
  );
  const ret = docSnapshot.data();
  console.debug("Payment", ret);
  return ret?.status;
};
