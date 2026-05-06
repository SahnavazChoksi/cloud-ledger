/**CloudLedger\frontend\hooks\useSheetActions.ts */

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
  const newFormula: Formula = {
    id: generateId(),
    name: data.name,
    kind: data.kind,
    operation: data.operation,
    sourceColumnId: data.sourceColumnId,
    ...(data.sourceColumnId2 ? { sourceColumnId2: data.sourceColumnId2 } : {}),
    ...(data.kind !== "summary" ? { targetColumnId: generateId() } : {}),
  };

  setSheets((prev) =>
    prev.map((sheet) => {
      if (sheet.id !== activeSheetId) return sheet;

      return {
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
        formulas: [...(sheet.formulas || []), newFormula],
      };
    }),
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

  const updateCell = (rowId: string, columnId: string, value: string) => {
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
                      sheet.columns.find((c) => c.id === columnId)?.type === "number"
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

  const moveColumn = (columnId: string, direction: "up" | "down") => {
    if (!activeSheet) return;

    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id !== activeSheetId) return sheet;

        const editableColumns = sheet.columns.filter((c) => c.type !== "formula");
        const currentIndex = editableColumns.findIndex((c) => c.id === columnId);
        if (currentIndex === -1) return sheet;

        const targetIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= editableColumns.length) return sheet;

        const reorderedEditable = [...editableColumns];
        [reorderedEditable[currentIndex], reorderedEditable[targetIndex]] = [
          reorderedEditable[targetIndex],
          reorderedEditable[currentIndex],
        ];

        const formulaColumns = sheet.columns.filter((c) => c.type === "formula");

        return {
          ...sheet,
          columns: [...reorderedEditable, ...formulaColumns],
        };
      }),
    );
  };

  const renameFormula = (formulaId: string, name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id !== activeSheetId) return sheet;

        const targetFormula = sheet.formulas.find((formula) => formula.id === formulaId);

        return {
          ...sheet,
          formulas: sheet.formulas.map((formula) =>
            formula.id === formulaId ? { ...formula, name: cleanName } : formula,
          ),
          columns: sheet.columns.map((column) =>
            targetFormula?.targetColumnId && column.id === targetFormula.targetColumnId
              ? { ...column, name: cleanName }
              : column,
          ),
        };
      }),
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
    moveColumn,
    renameFormula,
  };
}