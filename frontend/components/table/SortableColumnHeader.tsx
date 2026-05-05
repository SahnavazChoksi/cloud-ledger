/*CloudLedger\frontend\components\table\SortableColumnHeader.tsx */

"use client";

import { Column } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableColumnHeader({
  column,
  onDelete,
  onSort,
  sortConfig,
}: {
  column: Column;
  onDelete: (columnId: string) => void;
  onSort: (id: string) => void;
  sortConfig: {
    columnId: string;
    direction: "asc" | "desc";
  } | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="whitespace-nowrap border-b bg-gray-100 px-2 py-3 text-left md:px-4"
    >
      <button
  ref={setActivatorNodeRef}
  type="button"
  className="touch-none select-none rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-400"
  style={{ touchAction: "none" }}
  {...attributes}
  {...listeners}
>
  ☰
</button>

        <button
          type="button"
          onClick={() => onSort(column.id)}
          className="flex items-center gap-1 text-left font-semibold text-black"
        >
          <span className="max-w-[110px] truncate md:max-w-none">{column.name}</span>
          {sortConfig?.columnId === column.id ? (
            <span className="text-xs text-black">
              {sortConfig.direction === "asc" ? "↑" : "↓"}
            </span>
          ) : (
            <span className="text-xs text-gray-400">⇅</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onDelete(column.id)}
          className="ml-auto rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        >
          ×
        </button>
      </div>
    </th>
  );
}
