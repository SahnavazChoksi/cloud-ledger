/*CloudLedger\frontend\components\constants\help.ts*/

export const FORMULA_HELP: Record<
  "line" | "running" | "summary",
  { title: string; description: string; hint: string }
> = {
  line: {
    title: "Line Total",
    description: "Calculate one row using two columns.",
    hint: "Example: Amount × Quantity = Line Total.",
  },
  running: {
    title: "Running Total",
    description: "Keep adding values row by row from top to bottom.",
    hint: "Example: cumulative Amount across rows.",
  },
  summary: {
    title: "Grand Total",
    description:
      "Show one total for the whole column in the summary section below the table.",
    hint: "Example: total of the Amount column.",
  },
};

export const COLUMN_HELP: Record<
  "text" | "number" | "date",
  { title: string; description: string; hint: string }
> = {
  text: {
    title: "Text Column",
    description: "Use for names, labels, and notes.",
    hint: "Example: Company, Customer, Status.",
  },
  number: {
    title: "Number Column",
    description: "Use for values that can be calculated.",
    hint: "Example: Amount, Price, Quantity.",
  },
  date: {
    title: "Date Column",
    description: "Use for calendar dates.",
    hint: "Example: Invoice Date, Due Date.",
  },
};
