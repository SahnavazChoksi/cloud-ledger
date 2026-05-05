/*CloudLedger\frontend\components\header\AppHeader.tsx */

"use client";

import Link from "next/link";
import { logOut } from "@/lib/auth";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AppHeader({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="min-w-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-black md:hidden"
            aria-label="Open sheets menu"
          >
            ☰
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-black md:text-xl">
              CloudLedger
            </h1>
            {user?.displayName && (
              <p className="hidden truncate text-xs text-gray-500 sm:block">
                {user.displayName}
              </p>
            )}
          </div>
        </div>

        <div className="relative z-50 flex shrink-0 items-center gap-2">
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
    </header>
  );
}