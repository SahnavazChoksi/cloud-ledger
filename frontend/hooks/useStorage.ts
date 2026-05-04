import { useEffect } from "react";

import { loadAppData, saveAppData } from "@/utils/storage";

import { Sheet } from "@/types";

type UseStorageProps = {
  sheets: Sheet[];
  activeSheetId: string;

  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>;

  setActiveSheetId: React.Dispatch<React.SetStateAction<string>>;

  isLoaded: boolean;

  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useStorage({
  sheets,
  activeSheetId,
  setSheets,
  setActiveSheetId,
  isLoaded,
  setIsLoaded,
}: UseStorageProps) {
  useEffect(() => {
    const savedData = loadAppData();

    if (savedData) {
      setSheets(savedData.sheets || []);

      setActiveSheetId(savedData.activeSheetId || "1");
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    saveAppData(sheets, activeSheetId);
  }, [sheets, activeSheetId, isLoaded]);
}