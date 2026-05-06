/**CloudLedger\frontend\utils\summary.ts */

import { Sheet } from "@/types";
import { toNumber } from "@/utils/formula";

export function getSheetSummaryItems(sheet: Sheet) {
  const summaryFormulas = (sheet.formulas || []).filter(
    (formula) => formula.kind === "summary",
  );

  return summaryFormulas.map((formula) => ({
    id: formula.id,
    name: formula.name || "Summary",
    value: sheet.rows.reduce(
      (sum, row) => sum + toNumber(row.values[formula.sourceColumnId]),
      0,
    ),
  }));
}