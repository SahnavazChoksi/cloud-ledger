/*CloudLedger\frontend\utils\export.ts */

import { Sheet } from "@/types";
import { getComputedValue } from "@/utils/formula";

export const exportActiveSheet = async ({
  activeSheet,
  fileName,
  format,
}: {
  activeSheet: Sheet;
  fileName: string;
  format: "xlsx" | "pdf";
}) => {
  if (!activeSheet) return;

  const normalColumns = activeSheet.columns.filter((c) => c.type !== "formula");
  const formulaColumns = activeSheet.columns.filter(
    (c) => c.type === "formula",
  );
  const headers = [
    ...normalColumns.map((c) => c.name),
    ...formulaColumns.map((c) => c.name),
  ];

  const data = activeSheet.rows.map((row, rowIndex) => {
    const formulaValues: Record<string, string | number> = {};

    activeSheet.formulas.forEach((formula) => {
      if (!formula.targetColumnId) return;

      formulaValues[formula.targetColumnId] = getComputedValue({
        rowIndex,
        row,
        sheet: activeSheet,
        formula,
      });
    });

    return [
      ...normalColumns.map((c) => row.values[c.id] ?? ""),
      ...formulaColumns.map((c) => formulaValues[c.id] ?? ""),
    ];
  });

  if (format === "xlsx") {
    const XLSX = await import("xlsx");
    const worksheetData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeSheet.name);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    return;
  }

  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(activeSheet.name, 14, 15);

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 22,
    styles: { fontSize: 8, cellPadding: 2 },
  });

  doc.save(`${fileName}.pdf`);
};
