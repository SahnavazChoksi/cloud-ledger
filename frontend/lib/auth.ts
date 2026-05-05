/**CloudLedger\frontend\lib\auth.ts */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  if (displayName?.trim()) {
    await updateProfile(user, { displayName: displayName.trim() });
  }

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName: displayName?.trim() || user.displayName || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
}

export async function sendResetEmail(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function updateUserProfile(data: {
  displayName?: string;
}) {
  if (!auth.currentUser) throw new Error("No signed in user");

  await updateProfile(auth.currentUser, {
    displayName: data.displayName,
  });

  await setDoc(
    doc(db, "users", auth.currentUser.uid),
    {
      displayName: data.displayName ?? auth.currentUser.displayName ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function logOut() {
  await signOut(auth);
}