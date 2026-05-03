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
      <td className="px-4 py-3 w-[70px]">
        <button
          ref={setActivatorNodeRef}
          type="button"
          className="cursor-grab select-none px-3 py-3 rounded bg-gray-200 hover:bg-gray-300"
          style={{ touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          ☰
        </button>
      </td>

      {columns.map((column) => (
        <td key={column.id} className="text-black px-4 py-3">
          {column.type === "formula" ? (
            <div className="w-full min-w-[120px] border rounded-lg px-3 py-2 bg-gray-50">
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
              className="w-full min-w-[120px] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          )}
        </td>
      ))}

      <td className="px-4 py-3 w-[90px]">
        <button
          type="button"
          onClick={() => onDeleteRow(row.id)}
          className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
