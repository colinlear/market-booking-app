// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

export const stallStatusCollection = "stall-statuses";
export const marketCollection = "markets";
export const stallCollection = "stalls";
export const bookingCollection = "bookings";
export const stripePaymentsCollection = "stripe-payments";
