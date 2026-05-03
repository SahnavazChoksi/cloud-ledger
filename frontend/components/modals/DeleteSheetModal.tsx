/**CloudLedger\frontend\components\modals\DeleteSheetModal.tsx */

"use client";

import ModalShell from "./ModalShell";

export default function DeleteSheetModal({
  open,
  onClose,
  onConfirm,
  sheetName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sheetName: string;
}) {
  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Delete Sheet"
      subtitle="This action will permanently remove the selected sheet."
    >
      <div className="p-4 sm:p-6 space-y-4">
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          You are about to delete{" "}
          <span className="font-semibold">{sheetName}</span>. This cannot be
          undone.
        </div>
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
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          Delete Sheet
        </button>
      </div>
    </ModalShell>
  );
}
