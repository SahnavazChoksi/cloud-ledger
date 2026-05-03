/**CloudLedger\frontend\components\modals\ModalShell.tsx*/

import { ReactNode } from "react";

export default function ModalShell({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-auto">
        <div className="p-4 sm:p-6 border-b flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-black">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-black"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
