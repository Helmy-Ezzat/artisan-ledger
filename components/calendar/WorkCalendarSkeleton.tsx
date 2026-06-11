import { Skeleton } from "@/components/ui/Skeleton";

export function WorkCalendarSkeleton() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="min-w-0 flex-1 text-center">
          <Skeleton className="mx-auto mb-2 h-5 w-32" />
          <Skeleton className="mx-auto h-4 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="py-1 h-4 mx-auto" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 42 }).map((_, i) => (
          <Skeleton key={i} className="min-h-[44px] rounded-xl" />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}
