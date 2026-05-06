"use client";

import Link from "next/link";
import { logOut } from "@/lib/auth";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AppHeader({
  onOpenSidebar,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  onOpenSidebar: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="px-4 py-3 md:px-6">
        <div className="flex flex-col gap-3 sm:gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-black md:hidden"
              aria-label="Open sheets menu"
            >
              ☰
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-black md:text-xl">
                CloudLedger
              </h1>
              {user?.displayName && (
                <p className="truncate text-xs text-gray-500">
                  {user.displayName}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="inline-flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-40"
            >
              Undo
            </button>

            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="inline-flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-40"
            >
              Redo
            </button>

            <Link
              href="/profile"
              className="inline-flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-medium text-black hover:bg-gray-100"
            >
              Profile
            </Link>

            <button
              type="button"
              onClick={async () => {
                await logOut();
                window.location.href = "/login";
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}