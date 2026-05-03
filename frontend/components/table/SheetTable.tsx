/**CloudLedger\frontend\components\table\SheetTable.tsx */

"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Sheet, Row, Formula, Column } from "@/types";

import SortableColumnHeader from "./SortableColumnHeader";

import SortableRow from "./SortableRow";

import { getComputedValue } from "@/utils/formula";

export default function SheetTable({
  activeSheet,
  sensors,
  handleDragStart,
  handleDragEnd,
  deleteColumn,
  updateCell,
  deleteRow,
}: {
  activeSheet: Sheet | undefined;
  sensors: any;
  handleDragStart: any;
  handleDragEnd: any;
  deleteColumn: (columnId: string) => void;
  updateCell: (rowId: string, columnId: string, value: string) => void;
  deleteRow: (rowId: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 w-[70px] text-left text-black">Move</th>

              <SortableContext
                items={activeSheet?.columns.map((c) => c.id) || []}
                strategy={horizontalListSortingStrategy}
              >
                {activeSheet?.columns.map((column) => (
                  <SortableColumnHeader
                    key={column.id}
                    column={column}
                    onDelete={deleteColumn}
                  />
                ))}
              </SortableContext>

              <th className="px-4 py-3 w-[90px] text-left text-black">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <SortableContext
              items={activeSheet?.rows.map((r) => r.id) || []}
              strategy={verticalListSortingStrategy}
            >
              {activeSheet?.rows.map((row, rowIndex) => {
                const rowComputed: Record<string, string | number> = {};

                activeSheet.formulas
                  .filter(
                    (formula) =>
                      formula.kind !== "summary" && formula.targetColumnId,
                  )
                  .forEach((formula) => {
                    rowComputed[formula.targetColumnId as string] =
                      getComputedValue({
                        rowIndex,
                        row,
                        sheet: activeSheet,
                        formula,
                      });
                  });

                return (
                  <SortableRow
                    key={row.id}
                    row={row}
                    columns={activeSheet.columns}
                    updateCell={updateCell}
                    onDeleteRow={deleteRow}
                    computedValues={rowComputed}
                  />
                );
              })}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
