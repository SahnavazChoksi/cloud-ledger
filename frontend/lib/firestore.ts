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
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((docSnap) =>
    normalizeSheet(docSnap.id, docSnap.data() as Partial<Sheet> & Record<string, unknown>),
  );
}

export async function saveUserSheet(uid: string, sheet: Sheet) {
  const cleanSheet = {
    id: sheet.id,
    name: sheet.name || "Untitled Sheet",
    columns: (sheet.columns || []).map((column) => ({
      id: column.id,
      name: column.name,
      type: column.type,
    })),
    rows: (sheet.rows || []).map((row) => ({
      id: row.id,
      values: row.values || {},
    })),
    formulas: (sheet.formulas || []).map((formula) => ({
      id: formula.id,
      name: formula.name,
      kind: formula.kind,
      operation: formula.operation,
      sourceColumnId: formula.sourceColumnId,
      ...(formula.sourceColumnId2 ? { sourceColumnId2: formula.sourceColumnId2 } : {}),
      ...(formula.targetColumnId ? { targetColumnId: formula.targetColumnId } : {}),
    })),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", uid, "sheets", sheet.id), cleanSheet, {
    merge: true,
  });
}

export async function deleteUserSheet(uid: string, sheetId: string) {
  await deleteDoc(doc(db, "users", uid, "sheets", sheetId));
}