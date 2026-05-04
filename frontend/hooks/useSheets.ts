/* frontend/hooks/useSheets.ts */

import { useState } from "react";
import { Column, Formula, Row, Sheet } from "@/types";

export function useSheets() {
  const [sheets, setSheets] = useState<Sheet[]>([
    {
      id: "1",
      name: "Hospitality",
      columns: [
        { id: "c1", name: "Company", type: "text" },
        { id: "c2", name: "Amount", type: "number" },
      ],
      rows: [{ id: "r1", values: { c1: "Lupin", c2: 6500 } }],
      formulas: [],
    },
  ]);

  const [activeSheetId, setActiveSheetId] = useState("1");

  const activeSheet = sheets.find(
    (sheet) => sheet.id === activeSheetId,
  );

  const createSheet = (data: { name: string }) => {
    const newSheet: Sheet = {
      id: Date.now().toString(),
      name: data.name,
      columns: [],
      rows: [],
      formulas: [],
    };

    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetId(newSheet.id);
  };

  const deleteSheet = (sheetId: string) => {
    setSheets((prev) => {
      const nextSheets = prev.filter(
        (sheet) => sheet.id !== sheetId,
      );

      setActiveSheetId((current) => {
        if (current !== sheetId) return current;
        return nextSheets[0]?.id || "";
      });

      return nextSheets;
    });
  };

  const addColumn = (data: {
    name: string;
    type: "text" | "number" | "date";
  }) => {
    const newColumn: Column = {
      id: Date.now().toString(),
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
                values: {
                  ...row.values,
                  [newColumn.id]: "",
                },
              })),
            },
      ),
    );
  };

  const addRow = () => {
    if (!activeSheet) return;

    const newRow: Row = {
      id: Date.now().toString(),
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
                      sheet.columns.find(
                        (c) => c.id === columnId,
                      )?.type === "number"
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
              rows: sheet.rows.filter(
                (row) => row.id !== rowId,
              ),
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
              columns: sheet.columns.filter(
                (col) => col.id !== columnId,
              ),
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

  const addFormula = (data: {
    name: string;
    kind: "line" | "running" | "summary";
    operation:
      | "add"
      | "subtract"
      | "multiply"
      | "divide"
      | "sum";
    sourceColumnId: string;
    sourceColumnId2?: string;
  }) => {
    if (!activeSheet) return;

    const newFormula: Formula = {
      id: Date.now().toString(),
      name: data.name,
      kind: data.kind,
      operation: data.operation,
      sourceColumnId: data.sourceColumnId,
      sourceColumnId2: data.sourceColumnId2,
      targetColumnId:
        data.kind === "summary"
          ? undefined
          : Date.now().toString(),
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

  return {
    sheets,
    setSheets,
    activeSheetId,
    setActiveSheetId,
    activeSheet,
    createSheet,
    deleteSheet,
    addColumn,
    addRow,
    updateCell,
    deleteRow,
    deleteColumn,
    addFormula,
  };
}