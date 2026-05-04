"use client";

import { Column, Formula, Row, Sheet } from "@/types";
import { generateId } from "@/utils/id";

export function useSheetActions({
  sheets,
  setSheets,
  activeSheet,
  activeSheetId,
  setActiveSheetId,
  setDeleteSheetId,
  setDeleteSheetModalOpen,
}: {
  sheets: Sheet[];
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>;
  activeSheet?: Sheet;
  activeSheetId: string;
  setActiveSheetId: React.Dispatch<React.SetStateAction<string>>;
  setDeleteSheetId: React.Dispatch<React.SetStateAction<string | null>>;
  setDeleteSheetModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const createSheet = (data: { name: string }) => {
    const newSheet: Sheet = {
      id: generateId(),
      name: data.name,
      columns: [],
      rows: [],
      formulas: [],
    };

    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetId(newSheet.id);
  };

  const openDeleteSheetModal = (sheetId: string) => {
    setDeleteSheetId(sheetId);
    setDeleteSheetModalOpen(true);
  };

  const deleteSheet = (sheetId: string) => {
    setSheets((prev) => {
      const nextSheets = prev.filter((sheet) => sheet.id !== sheetId);

      setActiveSheetId((current) => {
        if (current !== sheetId) return current;
        return nextSheets[0]?.id || "";
      });

      return nextSheets;
    });

    setDeleteSheetId(null);
    setDeleteSheetModalOpen(false);
  };

  const addColumn = (data: {
    name: string;
    type: "text" | "number" | "date";
  }) => {
    const newColumn: Column = {
      id: generateId(),
      name: data.name,
      type: data.type,
    };

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              columns: [...sheet.columns, newColumn],
              rows: sheet.rows.map((row) => ({
                ...row,
                values: { ...row.values, [newColumn.id]: "" },
              })),
            },
      ),
    );
  };

  const addFormula = (data: {
    name: string;
    kind: "line" | "running" | "summary";
    operation: "add" | "subtract" | "multiply" | "divide" | "sum";
    sourceColumnId: string;
    sourceColumnId2?: string;
  }) => {
    if (!activeSheet) return;

    const newFormula: Formula = {
      id: generateId(),
      name: data.name,
      kind: data.kind,
      operation: data.operation,
      sourceColumnId: data.sourceColumnId,
      sourceColumnId2: data.sourceColumnId2,
      targetColumnId:
        data.kind === "summary" ? undefined : generateId(),
    };

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              columns:
                data.kind === "summary"
                  ? sheet.columns
                  : [
                      ...sheet.columns,
                      {
                        id: newFormula.targetColumnId as string,
                        name: data.name,
                        type: "formula",
                      },
                    ],
              formulas: [...sheet.formulas, newFormula],
            },
      ),
    );
  };

  const addRow = () => {
    if (!activeSheet) return;

    const newRow: Row = {
      id: generateId(),
      values: {},
    };

    activeSheet.columns.forEach((column) => {
      if (column.type !== "formula") {
        newRow.values[column.id] = "";
      }
    });

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              rows: [...sheet.rows, newRow],
            },
      ),
    );
  };

  const updateCell = (
    rowId: string,
    columnId: string,
    value: string,
  ) => {
    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id !== activeSheetId) return sheet;

        return {
          ...sheet,
          rows: sheet.rows.map((row) =>
            row.id !== rowId
              ? row
              : {
                  ...row,
                  values: {
                    ...row.values,
                    [columnId]:
                      sheet.columns.find((c) => c.id === columnId)?.type ===
                      "number"
                        ? value === ""
                          ? ""
                          : Number(value)
                        : value,
                  },
                },
          ),
        };
      }),
    );
  };

  const deleteRow = (rowId: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              rows: sheet.rows.filter((row) => row.id !== rowId),
            },
      ),
    );
  };

  const deleteColumn = (columnId: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              columns: sheet.columns.filter((col) => col.id !== columnId),
              formulas: sheet.formulas.filter(
                (formula) =>
                  formula.sourceColumnId !== columnId &&
                  formula.sourceColumnId2 !== columnId &&
                  (formula.targetColumnId
                    ? formula.targetColumnId !== columnId
                    : true),
              ),
              rows: sheet.rows.map((row) => {
                const nextValues = { ...row.values };
                delete nextValues[columnId];

                return {
                  ...row,
                  values: nextValues,
                };
              }),
            },
      ),
    );
  };

  return {
    createSheet,
    openDeleteSheetModal,
    deleteSheet,
    addColumn,
    addFormula,
    addRow,
    updateCell,
    deleteRow,
    deleteColumn,
  };
}