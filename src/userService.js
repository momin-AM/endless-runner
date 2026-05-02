import { db } from "./firebase.js";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { getUser } from "./authState.js"; // 🔥 IMPORTANT FIX

// 🏆 LEADERBOARD
export async function getLeaderboard() {
  const snap = await getDocs(collection(db, "users"));

  const data = [];

  snap.forEach(doc => {
    data.push(doc.data());
  });

  return data.sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0));
}

// 👤 USER STATS (FIXED)
export async function getUserStats() {
  const user = getUser(); // 🔥 FIXED (no more auth.currentUser)

  if (!user) {
    console.log("getUserStats: NO USER");
    return null;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    console.log("getUserStats: NO DATA");
    return null;
  }

  return snap.data();
}

// 🧾 CREATE USER IF NOT EXISTS (FIXED)
export async function createUserIfNotExists() {
  const user = getUser(); // 🔥 FIX

  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || "Unknown",
      photo: user.photoURL || "",
      bestScore: 0,
      bestCoins: 0
    });

    console.log("USER CREATED");
  }
}

// 📈 UPDATE SCORE (FIXED)
export async function updateScore(score, coins) {
  const user = getUser(); // 🔥 FIX

  if (!user) {
    console.log("NO USER - score not saved");
    return;
  }

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || "Unknown",
      bestScore: score,
      bestCoins: coins
    });

    console.log("NEW USER SCORE SAVED");
  } else {
    const data = snap.data();

    await updateDoc(ref, {
      bestScore: Math.max(data.bestScore || 0, score),
      bestCoins: Math.max(data.bestCoins || 0, coins)
    });

    console.log("RUN SAVED (updated best score + coins)");
  }
}