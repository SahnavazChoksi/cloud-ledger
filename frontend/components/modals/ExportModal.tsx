/**CloudLedger\frontend\components\modals\ExportModal.tsx*/

"use client";

import { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import { ExportModalState } from "@/types";

export default function ExportModal({
  open,
  onClose,
  onExport,
  defaultFileName,
}: {
  open: boolean;
  onClose: () => void;
  onExport: (fileName: string, format: "xlsx" | "pdf") => void;
  defaultFileName: string;
}) {
  const [state, setState] = useState<ExportModalState>({
    fileName: defaultFileName,
    format: "xlsx",
    error: "",
  });

  useEffect(() => {
    if (!open) return;
    setState({
      fileName: defaultFileName,
      format: "xlsx",
      error: "",
    });
  }, [open, defaultFileName]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Export Sheet"
      subtitle="Review the file name, choose a format, then download."
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            File Name
          </label>
          <input
            value={state.fileName}
            onChange={(e) =>
              setState((p) => ({ ...p, fileName: e.target.value, error: "" }))
            }
            className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can change this before saving.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Export Format
          </label>
          <select
            value={state.format}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                format: e.target.value as "xlsx" | "pdf",
                error: "",
              }))
            }
            className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 border text-sm text-gray-700">
          <div className="font-semibold text-black mb-1">Preview</div>
          <div>
            File: {state.fileName}.{state.format}
          </div>
          <div className="mt-1">This will export the current active sheet.</div>
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
          onClick={() => {
            const clean = state.fileName.trim();
            if (!clean) {
              setState((p) => ({ ...p, error: "Please enter a file name." }));
              return;
            }
            onExport(clean, state.format);
          }}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800"
        >
          Download
        </button>
      </div>
    </ModalShell>
  );
}
