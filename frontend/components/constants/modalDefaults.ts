import {
  ColumnModalState,
  ExportModalState,
  FormulaModalState,
  SheetModalState,
} from "@/types";

export const DEFAULT_SHEET_MODAL: SheetModalState = {
  name: "",
  error: "",
};

export const DEFAULT_COLUMN_MODAL: ColumnModalState = {
  name: "",
  type: "text",
  error: "",
};

export const DEFAULT_FORMULA_MODAL: FormulaModalState = {
  name: "",
  kind: "line",
  operation: "multiply",
  sourceColumnId: "",
  sourceColumnId2: "",
  error: "",
};

export const DEFAULT_EXPORT_MODAL = (
  fileName: string,
): ExportModalState => ({
  fileName,
  format: "xlsx",
  error: "",
});