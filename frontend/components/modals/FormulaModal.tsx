/**CloudLedger\frontend\components\modals\FormulaModal.tsx */

"use client";

import { useEffect, useState } from "react";

import ModalShell from "./ModalShell";

import { Column, FormulaModalState } from "@/types";

import { FORMULA_HELP } from "@/components/constants/help";

export default function FormulaModal({
  open,
  onClose,
  onSave,
  columns,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    kind: "line" | "running" | "summary";
    operation: "add" | "subtract" | "multiply" | "divide" | "sum";
    sourceColumnId: string;
    sourceColumnId2?: string;
  }) => void;
  columns: Column[];
}) {
  const [state, setState] = useState<FormulaModalState>({
    name: "",
    kind: "line",
    operation: "multiply",
    sourceColumnId: "",
    sourceColumnId2: "",
    error: "",
  });

  useEffect(() => {
    if (!open) return;
    setState({
      name: "",
      kind: "line",
      operation: "multiply",
      sourceColumnId: "",
      sourceColumnId2: "",
      error: "",
    });
  }, [open]);

  if (!open) return null;

  const currentHelp = FORMULA_HELP[state.kind];
  const showSecondColumn = state.kind === "line" && state.operation !== "sum";

  const handleSave = () => {
    if (!state.name.trim()) {
      return setState((p) => ({ ...p, error: "Please enter a formula name." }));
    }
    if (!state.sourceColumnId) {
      return setState((p) => ({
        ...p,
        error: "Please select a source column.",
      }));
    }
    if (showSecondColumn && !state.sourceColumnId2) {
      return setState((p) => ({
        ...p,
        error: "Please select a second column.",
      }));
    }

    onSave({
      name: state.name.trim(),
      kind: state.kind,
      operation: state.operation,
      sourceColumnId: state.sourceColumnId,
      sourceColumnId2: showSecondColumn ? state.sourceColumnId2 : undefined,
    });

    setState({
      name: "",
      kind: "line",
      operation: "multiply",
      sourceColumnId: "",
      sourceColumnId2: "",
      error: "",
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add Formula"
      subtitle="Choose a formula type, then pick the columns it should use."
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Formula Name
            </label>
            <input
              value={state.name}
              onChange={(e) =>
                setState((p) => ({ ...p, name: e.target.value, error: "" }))
              }
              placeholder="Line Total"
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Formula Type
            </label>
            <select
              value={state.kind}
              onChange={(e) => {
                const kind = e.target.value as FormulaModalState["kind"];
                setState((p) => ({
                  ...p,
                  kind,
                  operation: kind === "line" ? "multiply" : "sum",
                  sourceColumnId2: "",
                  error: "",
                }));
              }}
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="line">Line Total</option>
              <option value="running">Running Total</option>
              <option value="summary">Grand Total</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 border">
          <div className="font-semibold text-black">{currentHelp.title}</div>
          <div className="text-sm text-gray-600 mt-1">
            {currentHelp.description}
          </div>
          <div className="text-sm text-gray-500 mt-2">{currentHelp.hint}</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Source Column
            </label>
            <select
              value={state.sourceColumnId}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  sourceColumnId: e.target.value,
                  error: "",
                }))
              }
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select column</option>
              {columns
                .filter((c) => c.type !== "formula")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {showSecondColumn && (
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Second Column
              </label>
              <select
                value={state.sourceColumnId2}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    sourceColumnId2: e.target.value,
                    error: "",
                  }))
                }
                className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select column</option>
                {columns
                  .filter((c) => c.type !== "formula")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {state.kind === "line" && (
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Operation
            </label>
            <select
              value={state.operation}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  operation: e.target.value as FormulaModalState["operation"],
                  error: "",
                }))
              }
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            >
              <option value="multiply">Multiply</option>
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="divide">Divide</option>
            </select>
          </div>
        )}

        {state.error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {state.error}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border text-black hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800"
        >
          Save Formula
        </button>
      </div>
    </ModalShell>
  );
}
