import { Sheet } from "@/types";
import { toNumber } from "@/utils/formula";

export function getSheetSummaryItems(sheet: Sheet) {
  return sheet.formulas
    .filter((formula) => formula.kind === "summary")
    .map((formula) => ({
      id: formula.id,
      name: formula.name,
      value: sheet.rows.reduce(
        (sum, row) => sum + toNumber(row.values[formula.sourceColumnId]),
        0,
      ),
    }));
}