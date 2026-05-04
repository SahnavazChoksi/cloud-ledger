/*CloudLedger\frontend\components\modals\ColumnModal.tsx*/

"use client";

import { useEffect, useState } from "react";
import ModalShell from "./ModalShell";

import { ColumnModalState } from "@/types";

import { COLUMN_HELP } from "@/components/constants/help";

import { ColumnType } from "@/types";

import { DEFAULT_COLUMN_MODAL } from "@/components/constants/modalDefaults";

export default function ColumnModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; type: Exclude<ColumnType, "formula">; }) => void;
}) {
  const [state, setState] = useState<ColumnModalState>(DEFAULT_COLUMN_MODAL);

  useEffect(() => {
    if (!open) return;
    setState(DEFAULT_COLUMN_MODAL);
  }, [open]);

  if (!open) return null;

  const help = COLUMN_HELP[state.type];

  const handleSave = () => {
    if (!state.name.trim()) {
      return setState((p) => ({ ...p, error: "Please enter a column name." }));
    }
    onSave({ name: state.name.trim(), type: state.type });
    setState(DEFAULT_COLUMN_MODAL);
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add Column"
      subtitle="Choose a column name and type. Use the type that matches the data."
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Column Name
          </label>
          <input
            value={state.name}
            onChange={(e) =>
              setState((p) => ({ ...p, name: e.target.value, error: "" }))
            }
            placeholder="Column Name"
            className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Column Type
          </label>
          <select
            value={state.type}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                type: e.target.value as "text" | "number" | "date",
                error: "",
              }))
            }
            className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black text-black"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 border">
          <div className="font-semibold text-black">{help.title}</div>
          <div className="text-sm text-gray-600 mt-1">{help.description}</div>
          <div className="text-sm text-gray-500 mt-2">{help.hint}</div>
        </div>

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
          Save Column
        </button>
      </div>
    </ModalShell>
  );
}
