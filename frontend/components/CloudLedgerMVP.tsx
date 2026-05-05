/*CloudLedger\frontend\components\CloudLedgerMVP.tsx */

"use client";

import { useEffect, useState } from "react";
import { Sheet } from "@/types";
import { exportActiveSheet } from "@/utils/export";
import CreateSheetModal from "@/components/modals/CreateSheetModal";
import DeleteSheetModal from "./modals/DeleteSheetModal";
import ColumnModal from "./modals/ColumnModal";
import FormulaModal from "./modals/FormulaModal";
import ExportModal from "./modals/ExportModal";
import SheetSidebar from "./sidebar/SheetSidebar";
import { formatDateTimeForFileName } from "@/utils/date";
import SheetTable from "./table/SheetTable";
import SheetSummary from "./summary/SheetSummary";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useSheetActions } from "@/hooks/useSheetActions";
import SheetToolbar from "./header/SheetToolbar";
import AppHeader from "./header/AppHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserSheets, saveUserSheet, deleteUserSheet } from "@/lib/firestore";

export default function CloudLedgerMVP() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    columnId: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [activeSheetId, setActiveSheetId] = useState("");
  const [createSheetModalOpen, setCreateSheetModalOpen] = useState(false);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [deleteSheetId, setDeleteSheetId] = useState<string | null>(null);
  const [deleteSheetModalOpen, setDeleteSheetModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, loading } = useAuth();

  const activeSheet = sheets.find((sheet) => sheet.id === activeSheetId);
  const sheetToDelete = sheets.find((sheet) => sheet.id === deleteSheetId);

  const { sensors, handleDragStart, handleDragEnd } = useDragAndDrop({
    activeSheet,
    activeSheetId,
    setSheets,
  });

  const {
    createSheet,
    openDeleteSheetModal,
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

  const handleDeleteSheet = async (sheetId: string) => {
    if (user) {
      await deleteUserSheet(user.uid, sheetId);
    }

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

  const renameSheet = (name: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === activeSheetId ? { ...sheet, name } : sheet
      )
    );
  };

  const handleSort = (columnId: string) => {
  setSortConfig((prev) => {
    if (!prev || prev.columnId !== columnId) {
      return { columnId, direction: "asc" };
    }

    if (prev.direction === "asc") {
      return { columnId, direction: "desc" };
    }

    return null;
  });
};

  useEffect(() => {
    async function loadData() {
      if (loading) return;

      if (!user) {
        setSheets([]);
        setActiveSheetId("");
        setIsLoaded(true);
        return;
      }

      const cloudSheets = await getUserSheets(user.uid);

           if (cloudSheets.length > 0) {
        setSheets(cloudSheets);
        setActiveSheetId(cloudSheets[0].id);
      } else {
        setSheets([]);
        setActiveSheetId("");
      }

      setIsLoaded(true);
    }

    loadData();
  }, [user, loading]);

  useEffect(() => {
    async function persist() {
      if (!isLoaded || !user) return;
      await Promise.all(sheets.map((sheet) => saveUserSheet(user.uid, sheet)));
    }

    persist();
  }, [sheets, user, isLoaded]);

  const defaultExportName = `${activeSheet?.name || "Sheet"}_${formatDateTimeForFileName()}`;

  const processedSheet = activeSheet
    ? {
        ...activeSheet,
        rows: [...activeSheet.rows]
          .filter((row) =>
            Object.values(row.values).some((value) =>
              String(value).toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
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
    <div className="h-dvh overflow-hidden bg-gray-100">
      <AppHeader onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex h-[calc(100dvh-65px)] overflow-hidden">
        <SheetSidebar
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSelectSheet={setActiveSheetId}
          onCreateSheet={() => setCreateSheetModalOpen(true)}
          onDeleteSheet={openDeleteSheetModal}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 overflow-y-auto p-3 md:p-6">
          {!activeSheet ? (
            <div className="rounded-2xl border bg-white p-6 text-center shadow-sm md:p-8">
              <h2 className="text-xl font-bold text-black md:text-2xl">No sheets yet</h2>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Create a new sheet to start tracking your data.
              </p>
              <button
                onClick={() => setCreateSheetModalOpen(true)}
                className="mt-4 rounded-xl bg-black px-4 py-2 text-white"
              >
                + New Sheet
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <input
                    value={activeSheet.name}
                    onChange={(e) => renameSheet(e.target.value)}
                    className="w-full max-w-full border-b bg-transparent text-xl font-bold text-black outline-none focus:border-black md:text-2xl lg:max-w-md"
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
                  placeholder="Search rows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
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
        </main>
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
          if (deleteSheetId) handleDeleteSheet(deleteSheetId);
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