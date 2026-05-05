/*CloudLedger\frontend\lib\firestore.ts */

import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Sheet } from "@/types";

export async function getUserSheets(uid: string): Promise<Sheet[]> {
  const ref = collection(db, "users", uid, "sheets");
  const q = query(ref, orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Sheet, "id">),
  }));
}

export async function saveUserSheet(uid: string, sheet: Sheet) {
  await setDoc(
    doc(db, "users", uid, "sheets", sheet.id),
    {
      ...sheet,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteUserSheet(uid: string, sheetId: string) {
  await deleteDoc(doc(db, "users", uid, "sheets", sheetId));
}