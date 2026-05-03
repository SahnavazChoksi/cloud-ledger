/**CloudLedger\frontend\components\summary\SheetSummary.tsx */

"use client";

import { Sheet } from "@/types";
import { toNumber } from "@/utils/formula";

export default function SheetSummary({ activeSheet }: { activeSheet?: Sheet }) {
  if (!activeSheet) return null;

  const summaryFormulas = activeSheet.formulas.filter(
    (f) => f.kind === "summary",
  );
  if (!summaryFormulas.length) return null;

  return (
    <div className="border-t bg-gray-50 p-4">
      <div className="font-semibold text-black mb-2">Summary</div>
      <div className="space-y-1 text-black">
        {summaryFormulas.map((formula) => {
          const value = activeSheet.rows.reduce(
            (sum, row) => sum + toNumber(row.values[formula.sourceColumnId]),
            0,
          );

          return (
            <div key={formula.id}>
              {formula.name}: {value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
