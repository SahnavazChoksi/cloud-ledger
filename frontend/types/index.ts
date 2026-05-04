/*CloudLedger\frontend\types\index.ts */
export type ColumnType = "text" | "number" | "date" | "formula";

export type FormulaKind = "line" | "running" | "summary";

export type FormulaOperation =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "sum";

export type Column = {
  id: string;
  name: string;
  type: ColumnType;
};

export type Row = {
  id: string;
  values: Record<string, string | number>;
};

export type Formula = {
  id: string;
  name: string;
  kind: FormulaKind;
  operation: FormulaOperation;
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
  kind: FormulaKind;
  operation: FormulaOperation;
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
