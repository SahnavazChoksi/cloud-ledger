/**CloudLedger\frontend\components\header\SheetToolbar.tsx */

"use client";
import Button from "@/components/ui/Button";
import { logOut } from "@/lib/auth";

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
    <div className="flex flex-wrap gap-2">
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