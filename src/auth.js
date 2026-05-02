import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

let user = null;
let ready = false;

export function initAuth(callback) {
  onAuthStateChanged(auth, (u) => {
    user = u;
    ready = true;

    console.log("AUTH STATE:", u);

    callback?.(u);
  });
}

export function getUser() {
  return user;
}

export function isReady() {
  return ready;
}