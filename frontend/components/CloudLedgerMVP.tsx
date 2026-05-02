'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Column = {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'formula';
};

type Row = {
  id: string;
  values: Record<string, string | number>;
};

type Formula = {
  id: string;
  name: string;
  kind: 'line' | 'running' | 'summary';
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'sum';
  sourceColumnId: string;
  sourceColumnId2?: string;
  targetColumnId: string;
};

type Sheet = {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
  formulas: Formula[];
};

type FormulaModalState = {
  open: boolean;
  name: string;
  kind: 'line' | 'running' | 'summary';
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'sum';
  sourceColumnId: string;
  sourceColumnId2: string;
  error: string;
};

const FORMULA_HELP: Record<
  'line' | 'running' | 'summary',
  { title: string; description: string; hint: string }
> = {
  line: {
    title: 'Line Total',
    description: 'Calculate one row using two columns.',
    hint: 'Example: Amount × Quantity = Line Total.',
  },
  running: {
    title: 'Running Total',
    description: 'Keep adding values row by row from top to bottom.',
    hint: 'Example: cumulative Amount across rows.',
  },
  summary: {
    title: 'Grand Total',
    description: 'Show one total for the whole column at the bottom.',
    hint: 'Example: total of the Amount column.',
  },
};

function toNumber(value: string | number | undefined) {
  const n = Number(value ?? '');
  return Number.isFinite(n) ? n : 0;
}

function calcLineValue(row: Row, formula: Formula) {
  const a = toNumber(row.values[formula.sourceColumnId]);
  const b = toNumber(row.values[formula.sourceColumnId2 || '']);

  switch (formula.operation) {
    case 'add':
      return a + b;
    case 'subtract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      return b === 0 ? 0 : a / b;
    case 'sum':
      return a;
    default:
      return 0;
  }
}

function getComputedValue({
  rowIndex,
  row,
  sheet,
  formula,
}: {
  rowIndex: number;
  row: Row;
  sheet: Sheet;
  formula: Formula;
}) {
  if (formula.kind === 'line') return calcLineValue(row, formula);

  if (formula.kind === 'running') {
    const sourceKey = formula.sourceColumnId;
    let total = 0;

    for (let i = 0; i <= rowIndex; i += 1) {
      total += toNumber(sheet.rows[i]?.values[sourceKey]);
    }

    return total;
  }

  if (formula.kind === 'summary') {
    const sourceKey = formula.sourceColumnId;
    return sheet.rows.reduce((sum, current) => sum + toNumber(current.values[sourceKey]), 0);
  }

  return '';
}

function SortableColumnHeader({
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

function SortableRow({
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
    position: 'relative' as const,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t bg-white">
      <td className="px-4 py-3 w-[70px]">
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
      </td>

      {columns.map((column) => (
        <td key={column.id} className="text-black px-4 py-3">
          {column.type === 'formula' ? (
            <div className="w-full min-w-[120px] border rounded-lg px-3 py-2 bg-gray-50">
              {computedValues[column.id] ?? ''}
            </div>
          ) : (
            <input
              type={
                column.type === 'number'
                  ? 'number'
                  : column.type === 'date'
                  ? 'date'
                  : 'text'
              }
              value={row.values[column.id] ?? ''}
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

function FormulaModal({
  open,
  onClose,
  onSave,
  columns,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    kind: 'line' | 'running' | 'summary';
    operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'sum';
    sourceColumnId: string;
    sourceColumnId2?: string;
  }) => void;
  columns: Column[];
}) {
  const [state, setState] = useState<FormulaModalState>({
    open: false,
    name: '',
    kind: 'line',
    operation: 'multiply',
    sourceColumnId: '',
    sourceColumnId2: '',
    error: '',
  });

  if (!open) return null;

  const currentHelp = FORMULA_HELP[state.kind];

  const showSecondColumn = state.kind === 'line' && state.operation !== 'sum';

  const handleSave = () => {
    if (!state.name.trim()) {
      setState((p) => ({ ...p, error: 'Please enter a formula name.' }));
      return;
    }
    if (!state.sourceColumnId) {
      setState((p) => ({ ...p, error: 'Please select a source column.' }));
      return;
    }
    if (showSecondColumn && !state.sourceColumnId2) {
      setState((p) => ({ ...p, error: 'Please select a second column.' }));
      return;
    }

    onSave({
      name: state.name.trim(),
      kind: state.kind,
      operation: state.operation,
      sourceColumnId: state.sourceColumnId,
      sourceColumnId2: showSecondColumn ? state.sourceColumnId2 : undefined,
    });

    setState({
      open: false,
      name: '',
      kind: 'line',
      operation: 'multiply',
      sourceColumnId: '',
      sourceColumnId2: '',
      error: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-auto">
        <div className="p-4 sm:p-6 border-b flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-black">Add Formula</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose a formula type, then pick the columns it should use.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Formula Name
              </label>
              <input
                value={state.name}
                onChange={(e) => setState((p) => ({ ...p, name: e.target.value, error: '' }))}
                placeholder="Line Total"
                className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Formula Type
              </label>
              <select
                value={state.kind}
                onChange={(e) => {
                  const kind = e.target.value as FormulaModalState['kind'];
                  setState((p) => ({
                    ...p,
                    kind,
                    operation: kind === 'line' ? 'multiply' : 'sum',
                    sourceColumnId2: '',
                    error: '',
                  }));
                }}
                className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="line">Line Total</option>
                <option value="running">Running Total</option>
                <option value="summary">Grand Total</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 border">
            <div className="font-semibold text-black">{currentHelp.title}</div>
            <div className="text-sm text-gray-600 mt-1">{currentHelp.description}</div>
            <div className="text-sm text-gray-500 mt-2">{currentHelp.hint}</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Source Column
              </label>
              <select
                value={state.sourceColumnId}
                onChange={(e) =>
                  setState((p) => ({ ...p, sourceColumnId: e.target.value, error: '' }))
                }
                className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select column</option>
                {columns
                  .filter((c) => c.type !== 'formula')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {showSecondColumn && (
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Second Column
                </label>
                <select
                  value={state.sourceColumnId2}
                  onChange={(e) =>
                    setState((p) => ({ ...p, sourceColumnId2: e.target.value, error: '' }))
                  }
                  className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select column</option>
                  {columns
                    .filter((c) => c.type !== 'formula')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {state.kind === 'line' && (
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Operation
              </label>
              <select
                value={state.operation}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    operation: e.target.value as FormulaModalState['operation'],
                    error: '',
                  }))
                }
                className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="multiply">Multiply</option>
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="divide">Divide</option>
              </select>
            </div>
          )}

          {state.error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {state.error}
            </div>
          )}
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
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800"
          >
            Save Formula
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CloudLedgerMVP() {
  const [sheets, setSheets] = useState<Sheet[]>([
    {
      id: '1',
      name: 'Hospitality',
      columns: [
        { id: 'c1', name: 'Company', type: 'text' },
        { id: 'c2', name: 'Amount', type: 'number' },
      ],
      rows: [{ id: 'r1', values: { c1: 'Lupin', c2: 6500 } }],
      formulas: [],
    },
  ]);

  const [activeSheetId, setActiveSheetId] = useState('1');
  const [dragType, setDragType] = useState<'row' | 'column' | null>(null);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);

  const activeSheet = sheets.find((sheet) => sheet.id === activeSheetId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const createSheet = () => {
    const name = prompt('Enter sheet name');
    if (!name) return;

    const newSheet: Sheet = {
      id: Date.now().toString(),
      name,
      columns: [],
      rows: [],
      formulas: [],
    };

    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetId(newSheet.id);
  };

  const addColumn = () => {
    const name = prompt('Column name');
    if (!name) return;

    const type = prompt('Type: text, number, date') as
      | 'text'
      | 'number'
      | 'date'
      | null;

    const newColumn: Column = {
      id: Date.now().toString(),
      name,
      type: type || 'text',
    };

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              columns: [...sheet.columns, newColumn],
              rows: sheet.rows.map((row) => ({
                ...row,
                values: { ...row.values, [newColumn.id]: '' },
              })),
            }
      )
    );
  };

  const addFormula = (data: {
    name: string;
    kind: 'line' | 'running' | 'summary';
    operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'sum';
    sourceColumnId: string;
    sourceColumnId2?: string;
  }) => {
    if (!activeSheet) return;

    const targetColumnId = Date.now().toString();

    const formulaColumn: Column = {
      id: targetColumnId,
      name: data.name,
      type: 'formula',
    };

    const newFormula: Formula = {
      id: Date.now().toString(),
      name: data.name,
      kind: data.kind,
      operation: data.operation,
      sourceColumnId: data.sourceColumnId,
      sourceColumnId2: data.sourceColumnId2,
      targetColumnId,
    };

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              columns: [...sheet.columns, formulaColumn],
              formulas: [...sheet.formulas, newFormula],
            }
      )
    );
  };

  const addRow = () => {
    if (!activeSheet) return;

    const newRow: Row = { id: Date.now().toString(), values: {} };

    activeSheet.columns.forEach((column) => {
      if (column.type !== 'formula') newRow.values[column.id] = '';
    });

    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : { ...sheet, rows: [...sheet.rows, newRow] }
      )
    );
  };

  const updateCell = (rowId: string, columnId: string, value: string) => {
    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id !== activeSheetId) return sheet;

        return {
          ...sheet,
          rows: sheet.rows.map((row) =>
            row.id !== rowId
              ? row
              : {
                  ...row,
                  values: {
                    ...row.values,
                    [columnId]:
                      sheet.columns.find((c) => c.id === columnId)?.type === 'number'
                        ? value === ''
                          ? ''
                          : Number(value)
                        : value,
                  },
                }
          ),
        };
      })
    );
  };

  const deleteRow = (rowId: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : { ...sheet, rows: sheet.rows.filter((row) => row.id !== rowId) }
      )
    );
  };

  const deleteColumn = (columnId: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id !== activeSheetId
          ? sheet
          : {
              ...sheet,
              columns: sheet.columns.filter((col) => col.id !== columnId),
              formulas: sheet.formulas.filter(
                (formula) =>
                  formula.sourceColumnId !== columnId &&
                  formula.sourceColumnId2 !== columnId &&
                  formula.targetColumnId !== columnId
              ),
              rows: sheet.rows.map((row) => {
                const nextValues = { ...row.values };
                delete nextValues[columnId];
                return { ...row, values: nextValues };
              }),
            }
      )
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);

    if (activeSheet?.columns.some((c) => c.id === id)) setDragType('column');
    else if (activeSheet?.rows.some((r) => r.id === id)) setDragType('row');
    else setDragType(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !activeSheet) {
      setDragType(null);
      return;
    }

    if (dragType === 'row') {
      const oldIndex = activeSheet.rows.findIndex((r) => r.id === active.id);
      const newIndex = activeSheet.rows.findIndex((r) => r.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setSheets((prev) =>
          prev.map((sheet) =>
            sheet.id !== activeSheetId
              ? sheet
              : { ...sheet, rows: arrayMove(sheet.rows, oldIndex, newIndex) }
          )
        );
      }
    }

    if (dragType === 'column') {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="w-full md:w-72 bg-white border-r p-4">
        <h1 className="text-black text-2xl font-bold mb-4">CloudLedger</h1>

        <button
          onClick={createSheet}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          + New Sheet
        </button>

        <div className="mt-4 space-y-2">
          {sheets.map((sheet) => (
            <div
              key={sheet.id}
              onClick={() => setActiveSheetId(sheet.id)}
              className={`p-3 rounded-xl cursor-pointer transition ${
                activeSheetId === sheet.id
                  ? 'bg-black text-white'
                  : 'bg-gray-500 hover:bg-gray-200'
              }`}
            >
              {sheet.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-black text-2xl font-bold">{activeSheet?.name}</h2>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={addColumn}
                className="px-4 py-2 bg-black text-white border rounded-xl hover:bg-gray-500"
              >
                + Add Column
              </button>

              <button
                onClick={() => setFormulaModalOpen(true)}
                className="px-4 py-2 bg-black text-white border rounded-xl hover:bg-gray-500"
              >
                + Add Formula
              </button>

              <button
                onClick={addRow}
                className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-500"
              >
                + Add Row
              </button>
            </div>
          </div>

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

                    <th className="px-4 py-3 w-[90px] text-left text-black">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <SortableContext
                    items={activeSheet?.rows.map((r) => r.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {activeSheet?.rows.map((row, rowIndex) => {
                      const rowComputed: Record<string, string | number> = {};

                      activeSheet.formulas.forEach((formula) => {
                        rowComputed[formula.targetColumnId] = getComputedValue({
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

          {activeSheet?.formulas.length ? (
            <div className="border-t bg-gray-50 p-4">
              <div className="font-semibold text-black mb-2">Summary</div>
              <div className="space-y-1 text-black">
                {activeSheet.formulas
                  .filter((f) => f.kind === 'summary' || f.kind === 'running')
                  .map((formula) => {
                    const value = activeSheet.rows.reduce(
                      (sum, row) => sum + toNumber(row.values[formula.sourceColumnId]),
                      0
                    );

                    return (
                      <div key={formula.id}>
                        {formula.name}: {value}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <FormulaModal
        open={formulaModalOpen}
        onClose={() => setFormulaModalOpen(false)}
        onSave={(data) => {
          addFormula(data);
          setFormulaModalOpen(false);
        }}
        columns={activeSheet?.columns || []}
      />
    </div>
  );
}