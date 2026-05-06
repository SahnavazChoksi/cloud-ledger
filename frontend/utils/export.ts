/*CloudLedger\frontend\utils\export.ts */

import { Sheet } from "@/types";
import { toNumber } from "@/utils/formula";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type ExportActiveSheetParams = {
  activeSheet: Sheet;
  fileName: string;
  format: "xlsx" | "pdf";
  includeSummary?: boolean;
};

function getSheetSummaryItems(sheet: Sheet) {
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

function getCellDisplayValue(
  sheet: Sheet,
  row: Sheet["rows"][number],
  column: Sheet["columns"][number],
) {
  if (column.type !== "formula") {
    return row.values[column.id] ?? "";
  }

  const formula = sheet.formulas.find((f) => f.targetColumnId === column.id);
  if (!formula) return "";

  const a = toNumber(row.values[formula.sourceColumnId]);
  const b = formula.sourceColumnId2
    ? toNumber(row.values[formula.sourceColumnId2])
    : 0;

  if (formula.kind === "line") {
    switch (formula.operation) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        return b === 0 ? "" : a / b;
      case "sum":
        return a;
      default:
        return "";
    }
  }

  if (formula.kind === "running") {
    const rowIndex = sheet.rows.findIndex((r) => r.id === row.id);
    return sheet.rows
      .slice(0, rowIndex + 1)
      .reduce(
        (sum, currentRow) =>
          sum + toNumber(currentRow.values[formula.sourceColumnId]),
        0,
      );
  }

  return "";
}

export async function exportActiveSheet({
  activeSheet,
  fileName,
  format,
  includeSummary = false,
}: ExportActiveSheetParams) {
  const headers = activeSheet.columns.map((column) => column.name);

  const rows = activeSheet.rows.map((row) =>
    activeSheet.columns.map((column) =>
      getCellDisplayValue(activeSheet, row, column),
    ),
  );

  if (format === "xlsx") {
    const worksheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeSheet.name);

    if (includeSummary) {
      const summaryItems = getSheetSummaryItems(activeSheet);

      if (summaryItems.length) {
        const summaryData = [
          ["Summary Name", "Value"],
          ...summaryItems.map((item) => [item.name, item.value]),
        ];

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
      }
    }

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    return;
  }

  if (format === "pdf") {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text(activeSheet.name, 40, 40);

    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
   

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 72,
      theme: "grid",
      margin: { left: 40, right: 40 },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: [30, 30, 30],
        lineWidth: 0.6,
        lineColor: [215, 215, 215],
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [20, 20, 20],
        textColor: [255, 255, 255],
        lineWidth: 0.8,
        lineColor: [170, 170, 170],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [30, 30, 30],
        lineWidth: 0.6,
        lineColor: [220, 220, 220],
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
    });

    if (includeSummary) {
      const summaryItems = getSheetSummaryItems(activeSheet);

      if (summaryItems.length) {
        const finalY =
          (doc as jsPDF & {
            lastAutoTable?: { finalY?: number };
          }).lastAutoTable?.finalY ?? 72;

        let summaryY = finalY + 24;
        const pageHeight = doc.internal.pageSize.getHeight();

        if (summaryY > pageHeight - 120) {
          doc.addPage();
          summaryY = 40;
        }

        doc.setFontSize(13);
        doc.setTextColor(20, 20, 20);
        doc.text("Summary", 40, summaryY);

        autoTable(doc, {
          startY: summaryY + 10,
          head: [["Summary Name", "Value"]],
          body: summaryItems.map((item) => [item.name, String(item.value)]),
          theme: "grid",
          margin: { left: 40, right: 40 },
          styles: {
            fontSize: 10,
            cellPadding: 6,
            textColor: [30, 30, 30],
            lineWidth: 0.6,
            lineColor: [220, 220, 220],
            overflow: "linebreak",
            valign: "middle",
          },
          headStyles: {
            fillColor: [235, 235, 235],
            textColor: [25, 25, 25],
            lineWidth: 0.8,
            lineColor: [180, 180, 180],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
        });
      }
    }

    doc.save(`${fileName}.pdf`);
  }
}