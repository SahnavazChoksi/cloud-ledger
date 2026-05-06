/**CloudLedger\frontend\components\summary\SheetSummary.tsx */

"use client";

import { useState } from "react";
import { Sheet } from "@/types";
import { getSheetSummaryItems } from "@/utils/summary";

export default function SheetSummary({
  activeSheet,
  onRenameSummary,
  onDeleteSummary,
  onDeleteAllSummaries,
}: {
  activeSheet?: Sheet;
  onRenameSummary: (formulaId: string, name: string) => void;
  onDeleteSummary: (formulaId: string) => void;
  onDeleteAllSummaries: () => void;
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  if (!activeSheet) return null;

  const summaryItems = getSheetSummaryItems(activeSheet);

  return (
    <div className="border-t bg-gray-50 p-4 pb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="font-semibold text-black">Summary</div>

        {summaryItems.length > 0 &&
          (confirmDeleteAll ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onDeleteAllSummaries();
                  setConfirmDeleteAll(false);
                }}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm delete all
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteAll(false)}
                className="rounded-lg border px-3 py-2 text-sm font-medium text-black hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDeleteAll(true)}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Delete All
            </button>
          ))}
      </div>

      {!summaryItems.length ? (
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
          No summary added yet.
        </div>
      ) : (
        <div className="grid gap-3">
          {summaryItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <input
                    value={item.name}
                    onChange={(e) => onRenameSummary(item.id, e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-black"
                  />

                  {confirmingId === item.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteSummary(item.id);
                          setConfirmingId(null);
                        }}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Confirm delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="rounded-lg border px-3 py-2 text-sm font-medium text-black hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(item.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="rounded-lg bg-gray-50 px-3 py-3">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Total
                  </div>
                  <div className="mt-1 break-words text-2xl font-bold text-black">
                    {item.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}