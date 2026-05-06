"use client";

import ModalShell from "./ModalShell";
import Button from "@/components/ui/Button";
import { Column } from "@/types";

export default function ManageColumnsModal({
  open,
  onClose,
  columns,
  onMoveUp,
  onMoveDown,
  onDeleteColumn,
}: {
  open: boolean;
  onClose: () => void;
  columns: Column[];
  onMoveUp: (columnId: string) => void;
  onMoveDown: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}) {
  if (!open) return null;

  const editableColumns = columns.filter((c) => c.type !== "formula");

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Manage Columns"
      subtitle="Reorder or delete columns on mobile without drag and drop."
    >
      <div className="space-y-3 p-4 sm:p-6">
        {editableColumns.map((col, index) => (
          <div
            key={col.id}
            className="rounded-xl border bg-gray-50 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-medium text-black">{col.name}</div>
                <div className="text-xs text-gray-500">{col.type}</div>
              </div>

              <button
                type="button"
                onClick={() => onDeleteColumn(col.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                disabled={index === 0}
                onClick={() => onMoveUp(col.id)}
              >
                Up
              </Button>

              <Button
                variant="secondary"
                disabled={index === editableColumns.length - 1}
                onClick={() => onMoveDown(col.id)}
              >
                Down
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4 sm:p-6">
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    </ModalShell>
  );
}