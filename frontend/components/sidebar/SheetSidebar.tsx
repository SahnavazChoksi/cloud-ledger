/*CloudLedger\frontend\components\sidebar\SheetSidebar.tsx */

"use client";

import { Sheet } from "@/types";

export default function SheetSidebar({
  sheets,
  activeSheetId,
  onSelectSheet,
  onCreateSheet,
  onDeleteSheet,
  open,
  onClose,
}: {
  sheets: Sheet[];
  activeSheetId: string;
  onSelectSheet: (sheetId: string) => void;
  onCreateSheet: () => void;
  onDeleteSheet: (sheetId: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-dvh w-[280px] transform border-r bg-white p-4 transition-transform duration-300 md:static md:z-0 md:h-[calc(100dvh-0px)] md:w-72 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-bold text-black">Sheets</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-3 py-2 text-black"
          >
            ✕
          </button>
        </div>

        <button
          onClick={onCreateSheet}
          className="w-full rounded-xl bg-black py-3 text-white hover:bg-gray-700"
        >
          + New Sheet
        </button>

        <div className="mt-4 max-h-[calc(100dvh-140px)] overflow-y-auto">
          {sheets.length === 0 ? (
            <div className="rounded-xl border border-dashed p-4 text-center text-sm text-gray-500">
              No sheets yet. Create your first sheet to begin.
            </div>
          ) : (
            <div className="space-y-2">
              {sheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className={`rounded-xl p-3 transition ${
                    activeSheetId === sheet.id
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSheet(sheet.id);
                        onClose();
                      }}
                      className="flex-1 truncate text-left"
                    >
                      {sheet.name}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSheet(sheet.id)}
                      className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}