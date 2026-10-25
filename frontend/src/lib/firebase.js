import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAePMPgC1UZB4iAVITmcucvly8Guv8LzVo",
  authDomain: "khalilandsons-bc707.firebaseapp.com",
  projectId: "khalilandsons-bc707",
  storageBucket: "khalilandsons-bc707.firebasestorage.app",
  messagingSenderId: "45436775479",
  appId: "1:45436775479:web:7a7b1c78ba38fef1cde3b2",
  measurementId: "G-YC1JE0X11N"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export { signInWithPopup };
