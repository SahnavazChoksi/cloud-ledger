/*CloudLedger\frontend\types\index.ts */

export type Column = {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "formula";
};

export type Row = {
  id: string;
  values: Record<string, string | number>;
};

export type Formula = {
  id: string;
  name: string;
  kind: "line" | "running" | "summary";
  operation: "add" | "subtract" | "multiply" | "divide" | "sum";
  sourceColumnId: string;
  sourceColumnId2?: string;
  targetColumnId?: string;
};

export type Sheet = {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
  formulas: Formula[];
};

export type FormulaModalState = {
  name: string;
  kind: "line" | "running" | "summary";
  operation: "add" | "subtract" | "multiply" | "divide" | "sum";
  sourceColumnId: string;
  sourceColumnId2: string;
  error: string;
};

export type ExportModalState = {
  fileName: string;
  format: "xlsx" | "pdf";
  error: string;
};

export type ColumnModalState = {
  name: string;
  type: "text" | "number" | "date";
  error: string;
};

export type SheetModalState = {
  name: string;
  error: string;
};
