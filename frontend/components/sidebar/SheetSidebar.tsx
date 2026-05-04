/*CloudLedger\frontend\components\sidebar\SheetSidebar.tsx */

"use client";

import { Sheet } from "@/types";

export default function SheetSidebar({
  sheets,
  activeSheetId,
  onSelectSheet,
  onCreateSheet,
  onDeleteSheet,
}: {
  sheets: Sheet[];
  activeSheetId: string;
  onSelectSheet: (sheetId: string) => void;
  onCreateSheet: () => void;
  onDeleteSheet: (sheetId: string) => void;
}) {
  return (
    <div className="w-full md:w-72 bg-white border-r p-4">
      <h1 className="text-black text-2xl font-bold mb-4">CloudLedger</h1>

      <button
        onClick={onCreateSheet}
        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-500"
      >
        + New Sheet
      </button>

      <div className="mt-4">
        {sheets.length === 0 ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500 text-center">
            No sheets yet. Create your first sheet to begin.
          </div>
        ) : (
          <div className="space-y-2">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className={`p-3 rounded-xl transition ${
                  activeSheetId === sheet.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectSheet(sheet.id)}
                    className="flex-1 text-left"
                  >
                    {sheet.name}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSheet(sheet.id)}
                    className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
