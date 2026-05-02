import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXn7Pu-uGGJ3xIxEK7RDEC860LIS-jzmw",
  authDomain: "endless-runner-31a89.firebaseapp.com",
  projectId: "endless-runner-31a89",
  storageBucket: "endless-runner-31a89.firebasestorage.app",
  messagingSenderId: "1087274063975",
  appId: "1:1087274063975:web:fc666c636aa5aa8e599cc2",
  measurementId: "G-D7L2VXLHS4"
};

const app = initializeApp(firebaseConfig);

import { setPersistence, browserLocalPersistence } from "firebase/auth";

export const auth = getAuth(app);

// 🔥 THIS IS THE FIX
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence enabled");
  })
  .catch((err) => {
    console.error("Persistence error:", err);
  });
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

// 🔐 LOGIN

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);

    console.log("LOGIN SUCCESS:", result.user);
    return result.user;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
  }
}