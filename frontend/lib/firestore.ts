/*CloudLedger\frontend\lib\firestore.ts */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Sheet } from "@/types";

function normalizeSheet(id: string, data: Partial<Sheet> & Record<string, unknown>): Sheet {
  return {
    id,
    name: typeof data.name === "string" && data.name.trim() ? data.name : "Untitled Sheet",
    columns: Array.isArray(data.columns) ? (data.columns as Sheet["columns"]) : [],
    rows: Array.isArray(data.rows) ? (data.rows as Sheet["rows"]) : [],
    formulas: Array.isArray(data.formulas) ? (data.formulas as Sheet["formulas"]) : [],
  };
}

export async function getUserSheets(uid: string): Promise<Sheet[]> {
  const ref = collection(db, "users", uid, "sheets");

  try {
    const orderedSnapshot = await getDocs(query(ref, orderBy("updatedAt", "desc")));

    const sheets = orderedSnapshot.docs.map((docSnap) =>
      normalizeSheet(docSnap.id, docSnap.data() as Partial<Sheet> & Record<string, unknown>),
    );

    if (sheets.length > 0) {
      return sheets;
    }
  } catch (error) {
    console.warn("Falling back to unordered sheet fetch:", error);
  }

  const fallbackSnapshot = await getDocs(ref);

  return fallbackSnapshot.docs.map((docSnap) =>
    normalizeSheet(docSnap.id, docSnap.data() as Partial<Sheet> & Record<string, unknown>),
  );
}

export async function saveUserSheet(uid: string, sheet: Sheet) {
  const cleanSheet = {
    id: sheet.id,
    name: sheet.name || "Untitled Sheet",
    columns: Array.isArray(sheet.columns) ? sheet.columns : [],
    rows: Array.isArray(sheet.rows) ? sheet.rows : [],
    formulas: Array.isArray(sheet.formulas) ? sheet.formulas : [],
    updatedAt: serverTimestamp(),
  };

  await setDoc(
    doc(db, "users", uid, "sheets", sheet.id),
    cleanSheet,
    { merge: true },
  );
}

export async function deleteUserSheet(uid: string, sheetId: string) {
  await deleteDoc(doc(db, "users", uid, "sheets", sheetId));
}