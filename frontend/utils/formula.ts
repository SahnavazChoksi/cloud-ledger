/*CloudLedger\frontend\utils\formula.ts */

import { Formula, Row, Sheet } from "@/types";

export function toNumber(value: string | number | undefined) {
  const n = Number(value ?? "");
  return Number.isFinite(n) ? n : 0;
}

export function calcLineValue(row: Row, formula: Formula) {
  const a = toNumber(row.values[formula.sourceColumnId]);
  const b = toNumber(row.values[formula.sourceColumnId2 || ""]);

  switch (formula.operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return b === 0 ? 0 : a / b;
    case "sum":
      return a;
    default:
      return 0;
  }
}

export function getComputedValue({
  rowIndex,
  row,
  sheet,
  formula,
}: {
  rowIndex: number;
  row: Row;
  sheet: Sheet;
  formula: Formula;
}) {
  if (formula.kind === "line") return calcLineValue(row, formula);

  if (formula.kind === "running") {
    const sourceKey = formula.sourceColumnId;
    let total = 0;
    for (let i = 0; i <= rowIndex; i += 1) {
      total += toNumber(sheet.rows[i]?.values[sourceKey]);
    }
    return total;
  }

  if (formula.kind === "summary") {
    const sourceKey = formula.sourceColumnId;
    return sheet.rows.reduce(
      (sum, current) => sum + toNumber(current.values[sourceKey]),
      0,
    );
  }

  return "";
}
