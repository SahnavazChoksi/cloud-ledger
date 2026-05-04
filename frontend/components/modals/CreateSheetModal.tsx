/*CloudLedger\frontend\components\modals\CreateSheetModal.tsx */

"use client";

import { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import { SheetModalState } from "@/types";
import { DEFAULT_SHEET_MODAL } from "@/components/constants/modalDefaults";
import Button from "@/components/ui/Button";

export default function CreateSheetModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string }) => void;
}) {
  const [state, setState] = useState<SheetModalState>(
  DEFAULT_SHEET_MODAL,
);

  useEffect(() => {
    if (!open) return;
    setState(DEFAULT_SHEET_MODAL);
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    const clean = state.name.trim();
    if (!clean) {
      setState((p) => ({ ...p, error: "Please enter a sheet name." }));
      return;
    }

    onSave({ name: clean });
    setState(DEFAULT_SHEET_MODAL);
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Create Sheet"
      subtitle="Create a new sheet to organize a different set of records."
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1 ">
            Sheet Name
          </label>
          <input
            value={state.name}
            onChange={(e) =>
              setState((p) => ({ ...p, name: e.target.value, error: "" }))
            }
            placeholder="Sheet Name"
            className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black text-black"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Hospitality, Retail, Vendors, Invoices.
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 border">
          <div className="font-semibold text-black">What is a sheet?</div>
          <div className="text-sm text-gray-600 mt-1">
            A sheet is a separate workspace with its own columns, rows, and
            formulas.
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Use different sheets when you want to track different categories of
            data.
          </div>
        </div>

        {state.error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {state.error}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
       <Button
  type="button"
  variant="secondary"
  onClick={onClose}
>
  Cancel
</Button>
        <Button
  type="button"
  onClick={handleSave}
>
  Create Sheet
</Button>
      </div>
    </ModalShell>
  );
}
