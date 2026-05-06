/*CloudLedger\frontend\components\modals\ExportModal.tsx*/

"use client";

import { useEffect, useState } from "react";
import ModalShell from "./ModalShell";

type ExportModalState = {
  fileName: string;
  format: "xlsx" | "pdf";
  includeSummary: boolean;
  error: string;
};

function createDefaultState(defaultFileName: string): ExportModalState {
  return {
    fileName: defaultFileName,
    format: "xlsx",
    includeSummary: true,
    error: "",
  };
}

export default function ExportModal({
  open,
  onClose,
  onExport,
  defaultFileName,
}: {
  open: boolean;
  onClose: () => void;
  onExport: (options: {
    fileName: string;
    format: "xlsx" | "pdf";
    includeSummary: boolean;
  }) => void;
  defaultFileName: string;
}) {
  const [state, setState] = useState<ExportModalState>(
    createDefaultState(defaultFileName),
  );

  useEffect(() => {
    if (!open) return;
    setState(createDefaultState(defaultFileName));
  }, [open, defaultFileName]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Export Sheet"
      subtitle="Review the file name, choose a format, then download."
    >
      <div className="space-y-4 p-4 sm:p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-black">
            File Name
          </label>
          <input
            value={state.fileName}
            onChange={(e) =>
              setState((p) => ({ ...p, fileName: e.target.value, error: "" }))
            }
            className="w-full rounded-xl border px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
          />
          <p className="mt-1 text-xs text-gray-500">
            You can change this before saving.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-black">
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
            className="w-full rounded-xl border px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="pdf">PDF (.pdf)</option>
          </select>
        </div>

        {state.format === "pdf" && (
          <label className="flex items-start gap-3 rounded-xl border bg-gray-50 p-4">
            <input
              type="checkbox"
              checked={state.includeSummary}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  includeSummary: e.target.checked,
                  error: "",
                }))
              }
              className="mt-1"
            />
            <div>
              <div className="text-sm font-semibold text-black">
                Include summary totals
              </div>
              <div className="text-xs text-gray-600">
                Adds the Summary section at the end of the PDF.
              </div>
            </div>
          </label>
        )}

        <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
          <div className="mb-1 font-semibold text-black">Preview</div>
          <div>
            File: {state.fileName}.{state.format}
          </div>
          <div className="mt-1">This will export the current active sheet.</div>
        </div>

        {state.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:justify-end sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border px-4 py-2 text-black hover:bg-gray-100"
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

            onExport({
              fileName: clean,
              format: state.format,
              includeSummary: state.includeSummary,
            });
          }}
          className="rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Download
        </button>
      </div>
    </ModalShell>
  );
}