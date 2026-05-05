/*CloudLedger\frontend\components\table\SortableRow.tsx */

"use client";

import { Column, Row } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableRow({
  row,
  columns,
  updateCell,
  onDeleteRow,
  computedValues,
}: {
  row: Row;
  columns: Column[];
  updateCell: (rowId: string, columnId: string, value: string) => void;
  onDeleteRow: (rowId: string) => void;
  computedValues: Record<string, string | number>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
    position: "relative" as const,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t bg-white">
      <td className="w-[64px] px-2 py-3 md:px-4">
        <button
          ref={setActivatorNodeRef}
          type="button"
          className="rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-400"
          style={{ touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          ☰
        </button>
      </td>

      {columns.map((column) => (
        <td key={column.id} className="px-2 py-3 text-black md:px-4">
          {column.type === "formula" ? (
            <div className="min-w-[100px] rounded-lg border bg-gray-50 px-3 py-2 text-sm md:min-w-[120px]">
              {computedValues[column.id] ?? ""}
            </div>
          ) : (
            <input
              type={
                column.type === "number"
                  ? "number"
                  : column.type === "date"
                    ? "date"
                    : "text"
              }
              value={row.values[column.id] ?? ""}
              onChange={(e) => updateCell(row.id, column.id, e.target.value)}
              className="w-full min-w-[100px] rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black md:min-w-[120px]"
            />
          )}
        </td>
      ))}

      <td className="w-[88px] px-2 py-3 md:px-4">
        <button
          type="button"
          onClick={() => onDeleteRow(row.id)}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}