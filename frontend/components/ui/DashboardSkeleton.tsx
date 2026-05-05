"use client";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 animate-pulse">
      <div className="border-b bg-white px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-200 md:hidden" />
            <div>
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="mt-2 hidden h-3 w-24 rounded bg-gray-100 sm:block" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-20 rounded-xl bg-gray-200" />
            <div className="h-10 w-20 rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="hidden w-72 border-r bg-white p-4 md:block">
          <div className="h-11 w-full rounded-xl bg-gray-200" />
          <div className="mt-4 space-y-3">
            <div className="h-14 rounded-xl bg-gray-100" />
            <div className="h-14 rounded-xl bg-gray-100" />
            <div className="h-14 rounded-xl bg-gray-100" />
          </div>
        </aside>

        <main className="flex-1 p-3 md:p-6">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-4">
              <div className="flex flex-col gap-4">
                <div className="h-8 w-52 rounded bg-gray-200" />

                <div className="flex flex-wrap gap-2">
                  <div className="h-10 w-28 rounded-xl bg-gray-200" />
                  <div className="h-10 w-28 rounded-xl bg-gray-200" />
                  <div className="h-10 w-28 rounded-xl bg-gray-200" />
                  <div className="h-10 w-24 rounded-xl bg-gray-200" />
                </div>

                <div className="h-10 w-full rounded-xl bg-gray-100" />
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="hidden grid-cols-5 gap-3 border-b bg-gray-50 p-4 md:grid">
                <div className="h-4 rounded bg-gray-200" />
                <div className="h-4 rounded bg-gray-200" />
                <div className="h-4 rounded bg-gray-200" />
                <div className="h-4 rounded bg-gray-200" />
                <div className="h-4 rounded bg-gray-200" />
              </div>

              <div className="space-y-3 p-4">
                <div className="h-12 rounded-xl bg-gray-100" />
                <div className="h-12 rounded-xl bg-gray-100" />
                <div className="h-12 rounded-xl bg-gray-100" />
                <div className="h-12 rounded-xl bg-gray-100" />
                <div className="h-12 rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}