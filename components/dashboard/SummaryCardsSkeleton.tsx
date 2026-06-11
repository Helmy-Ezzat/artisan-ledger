import { Skeleton } from "@/components/ui/Skeleton";

export function SummaryCardsSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      {/* Financial Section Skeleton */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-slate-50 px-2 py-3 text-center">
              <Skeleton className="mx-auto mb-1 h-3 w-10" />
              <Skeleton className="mx-auto h-6 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Work Stats Section Skeleton */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-slate-50 px-2 py-3 text-center">
              <Skeleton className="mx-auto mb-2 h-1.5 w-8 rounded-full" />
              <Skeleton className="mx-auto h-8 w-8 rounded" />
              <Skeleton className="mx-auto mt-1 h-3 w-14" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Recent Payments Section Skeleton */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        <ul className="space-y-3">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="shrink-0 h-5 w-20" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
