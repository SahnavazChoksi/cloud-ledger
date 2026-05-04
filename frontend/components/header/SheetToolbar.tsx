"use client";
import Button from "@/components/ui/Button";

export default function SheetToolbar({
  onAddColumn,
  onAddFormula,
  onAddRow,
  onExport,
}: {
  onAddColumn: () => void;
  onAddFormula: () => void;
  onAddRow: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={onAddColumn}>
  + Add Column
</Button>

      <Button onClick={onAddFormula}>
  + Add Formula
</Button>

      <Button onClick={onAddRow}>
  + Add Row
</Button>

      <Button onClick={onExport}>
  Export
</Button>
    </div>
  );
}