/*CloudLedger\frontend\components\CloudLedgerMVP.tsx */

"use client";

import { useState } from "react";

import { Sheet } from "@/types";

import { exportActiveSheet } from "@/utils/export";

import CreateSheetModal from "@/components/modals/CreateSheetModal";

import DeleteSheetModal from "./modals/DeleteSheetModal";

import ColumnModal from "./modals/ColumnModal";

import FormulaModal from "./modals/FormulaModal";

import ExportModal from "./modals/ExportModal";

import SheetSidebar from "./sidebar/SheetSidebar";

import { useStorage } from "@/hooks/useStorage";

import { formatDateTimeForFileName } from "@/utils/date";

import SheetTable from "./table/SheetTable";

import SheetSummary from "./summary/SheetSummary";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";

import { useSheetActions } from "@/hooks/useSheetActions";

import SheetToolbar from "./header/SheetToolbar";

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
const [searchQuery, setSearchQuery] = useState("");
const [sortConfig, setSortConfig] = useState<{
  columnId: string;
  direction: "asc" | "desc";
} | null>(null);
  const [activeSheetId, setActiveSheetId] = useState("1");
  const [createSheetModalOpen, setCreateSheetModalOpen] = useState(false);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deleteSheetId, setDeleteSheetId] = useState<string | null>(null);
  const [deleteSheetModalOpen, setDeleteSheetModalOpen] = useState(false);
  const activeSheet = sheets.find((sheet) => sheet.id === activeSheetId);
  const sheetToDelete = sheets.find((sheet) => sheet.id === deleteSheetId);

  const {
  sensors,
  handleDragStart,
  handleDragEnd,
} = useDragAndDrop({
  activeSheet,
  activeSheetId,
  setSheets,
});

const {
  createSheet,
  openDeleteSheetModal,
  deleteSheet,
  addColumn,
  addFormula,
  addRow,
  updateCell,
  deleteRow,
  deleteColumn,
} = useSheetActions({
  sheets,
  setSheets,
  activeSheet,
  activeSheetId,
  setActiveSheetId,
  setDeleteSheetId,
  setDeleteSheetModalOpen,
});

const renameSheet = (name: string) => {
  setSheets((prev) =>
    prev.map((sheet) =>
      sheet.id === activeSheetId
        ? { ...sheet, name }
        : sheet
    )
  );
};

const handleSort = (columnId: string) => {
  setSortConfig((prev) => {
    if (prev?.columnId === columnId) {
      return {
        columnId,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    }
    return { columnId, direction: "asc" };
  });
};

  useStorage({
  sheets,
  activeSheetId,
  setSheets,
  setActiveSheetId,
  isLoaded,
  setIsLoaded,
});

 
  const defaultExportName = `${activeSheet?.name || "Sheet"}_${formatDateTimeForFileName()}`;

  const processedSheet = activeSheet
  ? {
      ...activeSheet,
      rows: [...activeSheet.rows]
        // 🔍 FILTER
        .filter((row) =>
          Object.values(row.values).some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        )
        // 🔽 SORT
        .sort((a, b) => {
          if (!sortConfig) return 0;

          const aVal = a.values[sortConfig.columnId];
          const bVal = b.values[sortConfig.columnId];

          if (aVal === bVal) return 0;

          if (sortConfig.direction === "asc") {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        }),
    }
  : undefined;

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
            <div className="p-4 border-b flex flex-col gap-4">
  
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <input
      value={activeSheet.name}
      onChange={(e) => renameSheet(e.target.value)}
      className="text-2xl font-bold text-black border-b outline-none bg-transparent focus:border-black"
    />

    <SheetToolbar
      onAddColumn={() => setColumnModalOpen(true)}
      onAddFormula={() => setFormulaModalOpen(true)}
      onAddRow={addRow}
      onExport={() => setExportModalOpen(true)}
    />
  </div>

  <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black text-black"
  />

</div>

            <SheetTable
              activeSheet={processedSheet}
              sensors={sensors}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              deleteColumn={deleteColumn}
              updateCell={updateCell}
              deleteRow={deleteRow}
                handleSort={handleSort}
                sortConfig={sortConfig}

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
