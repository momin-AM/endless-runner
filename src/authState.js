import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

let user = null;
let ready = false;

const listeners = [];

export function initAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      user = u;
      ready = true;

      console.log("AUTH UPDATED:", u);

      listeners.forEach((cb) => cb(u));

      resolve(u); // 🔥 wait until Firebase resolves user
      unsubscribe(); // only run once
    });
  });
}

export function getUser() {
  return user;
}

export function isAuthReady() {
  return ready;
}

export function subscribeAuth(callback) {
  listeners.push(callback);

  if (ready) callback(user);
}