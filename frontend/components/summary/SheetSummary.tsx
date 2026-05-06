/**CloudLedger\frontend\components\summary\SheetSummary.tsx */

"use client";

import { Sheet } from "@/types";
import { getSheetSummaryItems } from "@/utils/summary";

export default function SheetSummary({
  activeSheet,
  onRenameSummary,
}: {
  activeSheet?: Sheet;
  onRenameSummary: (formulaId: string, name: string) => void;
}) {
  if (!activeSheet) return null;

  const summaryItems = getSheetSummaryItems(activeSheet);

  return (
    <div className="border-t bg-gray-50 p-4 pb-8">
      <div className="mb-3 font-semibold text-black">Summary</div>

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
                <input
                  value={item.name}
                  onChange={(e) => onRenameSummary(item.id, e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-black"
                />

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