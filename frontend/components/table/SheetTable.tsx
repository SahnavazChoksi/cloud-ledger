/**CloudLedger\frontend\components\table\SheetTable.tsx */

"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Sheet } from "@/types";
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
  handleSort,
  sortConfig,
}: {
  activeSheet: Sheet | undefined;
  sensors: any;
  handleDragStart: any;
  handleDragEnd: any;
  deleteColumn: (columnId: string) => void;
  updateCell: (rowId: string, columnId: string, value: string) => void;
  deleteRow: (rowId: string) => void;
  handleSort: (columnId: string) => void;
  sortConfig: {
    columnId: string;
    direction: "asc" | "desc";
  } | null;
}) {
  return (
    <div className="w-full overflow-hidden">
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[70px] px-4 py-3 text-left text-black">Move</th>

                  <SortableContext
                    items={activeSheet?.columns.map((c) => c.id) || []}
                    strategy={horizontalListSortingStrategy}
                  >
                    {activeSheet?.columns.map((column) => (
                      <SortableColumnHeader
                        key={column.id}
                        column={column}
                        onDelete={deleteColumn}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      />
                    ))}
                  </SortableContext>

                  <th className="w-[90px] px-4 py-3 text-left text-black">Actions</th>
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
                          formula.kind !== "summary" && formula.targetColumnId
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
      </div>
    </div>
  );
}