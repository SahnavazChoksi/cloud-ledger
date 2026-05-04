/*CloudLedger\frontend\components\table\SortableColumnHeader.tsx */

"use client";

import { Column } from "@/types";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableColumnHeader({
  column,
  onDelete,
  onSort,
  sortConfig
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
      className="text-white text-left px-4 py-3 whitespace-nowrap bg-gray-100 border-b"
    >
      <div className="flex items-center gap-2">
  <button
    ref={setActivatorNodeRef}
    type="button"
    className="cursor-grab px-3 py-3 rounded bg-gray-500 hover:bg-gray-300"
    {...attributes}
    {...listeners}
  >
    ☰
  </button>

  <div
  onClick={() => onSort(column.id)}
  className="font-semibold text-black cursor-pointer flex items-center gap-1"
>
  {column.name}

  {sortConfig?.columnId === column.id ? (
    <span className="text-xs text-black">
      {sortConfig.direction === "asc" ? "↑" : "↓"}
    </span>
  ) : (
    <span className="text-gray-400 text-xs">⇅</span>
  )}
</div>

  <button
    onClick={() => onDelete(column.id)}
    className="ml-auto px-2 py-1 rounded bg-red-500 text-white"
  >
    ×
  </button>
</div>
    </th>
  );
}
