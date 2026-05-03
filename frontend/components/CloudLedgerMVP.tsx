/*CloudLedger\frontend\components\CloudLedgerMVP.tsx */

"use client";

import { useEffect, useState } from "react";
import { Column, Row, Formula, Sheet } from "@/types";
import { exportActiveSheet } from "@/utils/export";

import CreateSheetModal from "@/components/modals/CreateSheetModal";

import DeleteSheetModal from "./modals/DeleteSheetModal";

import ColumnModal from "./modals/ColumnModal";

import FormulaModal from "./modals/FormulaModal";

import ExportModal from "./modals/ExportModal";

import SheetSidebar from "./sidebar/SheetSidebar";
import { loadAppData, saveAppData } from "@/utils/storage";

import { formatDateTimeForFileName } from "@/utils/date";

import SheetTable from "./table/SheetTable";

import SheetSummary from "./summary/SheetSummary";

import {
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export default function CloudLedgerMVP() {
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
  const [dragType, setDragType] = useState<"row" | "column" | null>(null);
  const [createSheetModalOpen, setCreateSheetModalOpen] = useState(false);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deleteSheetId, setDeleteSheetId] = useState<string | null>(null);
  const [deleteSheetModalOpen, setDeleteSheetModalOpen] = useState(false);
  const activeSheet = sheets.find((sheet) => sheet.id === activeSheetId);
  const sheetToDelete = sheets.find((sheet) => sheet.id === deleteSheetId);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const defaultExportName = `${activeSheet?.name || "Sheet"}_${formatDateTimeForFileName()}`;

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
      id: Date.now().toString(),
      name: data.name,
      kind: data.kind,
      operation: data.operation,
      sourceColumnId: data.sourceColumnId,
      sourceColumnId2: data.sourceColumnId2,
      targetColumnId:
        data.kind === "summary" ? undefined : Date.now().toString(),
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

    const newRow: Row = { id: Date.now().toString(), values: {} };

    activeSheet.columns.forEach((column) => {
      if (column.type !== "formula") newRow.values[column.id] = "";
    });

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : { ...sheet, rows: [...sheet.rows, newRow] },
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
          : { ...sheet, rows: sheet.rows.filter((row) => row.id !== rowId) },
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
                return { ...row, values: nextValues };
              }),
            },
      ),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (activeSheet?.columns.some((c) => c.id === id)) setDragType("column");
    else if (activeSheet?.rows.some((r) => r.id === id)) setDragType("row");
    else setDragType(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activeSheet) {
      setDragType(null);
      return;
    }

    if (dragType === "row") {
      const oldIndex = activeSheet.rows.findIndex((r) => r.id === active.id);
      const newIndex = activeSheet.rows.findIndex((r) => r.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setSheets((prev) =>
          prev.map((sheet) =>
            sheet.id !== activeSheetId
              ? sheet
              : { ...sheet, rows: arrayMove(sheet.rows, oldIndex, newIndex) },
          ),
        );
      }
    }

    if (dragType === "column") {
      const oldIndex = activeSheet.columns.findIndex((c) => c.id === active.id);
      const newIndex = activeSheet.columns.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setSheets((prev) =>
          prev.map((sheet) =>
            sheet.id !== activeSheetId
              ? sheet
              : {
                  ...sheet,
                  columns: arrayMove(sheet.columns, oldIndex, newIndex),
                },
          ),
        );
      }
    }

    setDragType(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <SheetSidebar
        sheets={sheets}
        activeSheetId={activeSheetId}
        onSelectSheet={setActiveSheetId}
        onCreateSheet={() => setCreateSheetModalOpen(true)}
        onDeleteSheet={openDeleteSheetModal}
      />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {!activeSheet ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <h2 className="text-black text-2xl font-bold">No sheets yet</h2>
            <p className="mt-2 text-gray-600">
              Create a new sheet to start tracking your data.
            </p>
            <button
              onClick={() => setCreateSheetModalOpen(true)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-xl"
            >
              + New Sheet
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-black text-2xl font-bold">
                {activeSheet.name}
              </h2>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setColumnModalOpen(true)}
                  className="px-4 py-2 bg-black text-white border rounded-xl hover:bg-gray-500"
                >
                  + Add Column
                </button>

                <button
                  onClick={() => setFormulaModalOpen(true)}
                  className="px-4 py-2 bg-black text-white border rounded-xl hover:bg-gray-500"
                >
                  + Add Formula
                </button>

                <button
                  onClick={addRow}
                  className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-500"
                >
                  + Add Row
                </button>

                <button
                  onClick={() => setExportModalOpen(true)}
                  className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-500"
                >
                  Export
                </button>
              </div>
            </div>

            <SheetTable
              activeSheet={activeSheet}
              sensors={sensors}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              deleteColumn={deleteColumn}
              updateCell={updateCell}
              deleteRow={deleteRow}
            />

            <SheetSummary activeSheet={activeSheet} />
          </div>
        )}
      </div>
      <CreateSheetModal
        open={createSheetModalOpen}
        onClose={() => setCreateSheetModalOpen(false)}
        onSave={(data) => {
          createSheet(data);
          setCreateSheetModalOpen(false);
        }}
      />

      <DeleteSheetModal
        open={deleteSheetModalOpen}
        onClose={() => {
          setDeleteSheetModalOpen(false);
          setDeleteSheetId(null);
        }}
        onConfirm={() => {
          if (deleteSheetId) deleteSheet(deleteSheetId);
        }}
        sheetName={sheetToDelete?.name || "this sheet"}
      />

      <ColumnModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        onSave={(data) => {
          addColumn(data);
          setColumnModalOpen(false);
        }}
      />

      <FormulaModal
        open={formulaModalOpen}
        onClose={() => setFormulaModalOpen(false)}
        onSave={(data) => {
          addFormula(data);
          setFormulaModalOpen(false);
        }}
        columns={activeSheet?.columns || []}
      />

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        defaultFileName={defaultExportName}
        onExport={async (fileName, format) => {
          if (!activeSheet) return;

          await exportActiveSheet({
            activeSheet,
            fileName,
            format,
          });
          setExportModalOpen(false);
        }}
      />
    </div>
  );
}
