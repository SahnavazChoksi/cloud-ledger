/*CloudLedger\frontend\utils\storage.ts*/

import { Sheet } from "@/types";

export function loadAppData() {
  const savedData = localStorage.getItem("cloudledger-data");

  if (!savedData) {
    return null;
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    console.error("Failed to load saved data", error);
    return null;
  }
}

export function saveAppData(sheets: Sheet[], activeSheetId: string) {
  localStorage.setItem(
    "cloudledger-data",
    JSON.stringify({
      sheets,
      activeSheetId,
    }),
  );
}
