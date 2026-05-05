/**CloudLedger\frontend\hooks\useDragAndDrop.ts */

import { useState } from "react";
import React from "react";

import {
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { Sheet } from "@/types";

type UseDragAndDropProps = {
  activeSheet: Sheet | undefined;
  activeSheetId: string;
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>;
};

export function useDragAndDrop({
  activeSheet,
  activeSheetId,
  setSheets,
}: UseDragAndDropProps) {
  const [dragType, setDragType] = useState<"row" | "column" | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);

    if (activeSheet?.columns.some((c) => c.id === id)) {
      setDragType("column");
    } else if (activeSheet?.rows.some((r) => r.id === id)) {
      setDragType("row");
    } else {
      setDragType(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !activeSheet) {
      setDragType(null);
      return;
    }

    if (dragType === "row") {
      const oldIndex = activeSheet.rows.findIndex((r) => r.id === active.id);
      const newIndex = activeSheet.rows.findIndex((r) => r.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setSheets((prev) =>
          prev.map((sheet) =>
            sheet.id !== activeSheetId
              ? sheet
              : {
                  ...sheet,
                  rows: arrayMove(sheet.rows, oldIndex, newIndex),
                }
          )
        );
      }
    }

    if (dragType === "column") {
      const oldIndex = activeSheet.columns.findIndex((c) => c.id === active.id);
      const newIndex = activeSheet.columns.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setSheets((prev) =>
          prev.map((sheet) =>
            sheet.id !== activeSheetId
              ? sheet
              : {
                  ...sheet,
                  columns: arrayMove(sheet.columns, oldIndex, newIndex),
                }
          )
        );
      }
    }

    setDragType(null);
  };

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}