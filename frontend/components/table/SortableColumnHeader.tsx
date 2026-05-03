/**C:\Users\sahna\OneDrive\Desktop\CloudLedger\frontend\components\table\SortableColumnHeader.tsx */

'use client';

import { Column } from '@/types';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableColumnHeader({
  column,
  onDelete,
}: {
  column: Column;
  onDelete: (columnId: string) => void;
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
      className="text-black text-left px-4 py-3 whitespace-nowrap bg-gray-100 border-b"
    >
      <div className="flex items-center gap-2">
        <button
          ref={setActivatorNodeRef}
          type="button"
          className="cursor-grab select-none px-3 py-3 rounded bg-gray-200 hover:bg-gray-300"
          style={{ touchAction: 'none' }}
          {...attributes}
          {...listeners}
        >
          ☰
        </button>
        <span className="font-semibold">{column.name}</span>
        <button
          type="button"
          onClick={() => onDelete(column.id)}
          className="ml-auto px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          ×
        </button>
      </div>
    </th>
  );
}
