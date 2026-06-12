import { Suspense } from "react";
import { getReportsData, getClientNames } from "@/lib/data";
import { ReportsClient } from "./ReportsClient";

async function ReportsServer() {
  const [reportsData, clientNames] = await Promise.all([
    getReportsData(),
    getClientNames(),
  ]);

  return (
    <ReportsClient
      initialWorkDays={reportsData.allWorkDays}
      initialPayments={reportsData.allPayments}
      clientNames={clientNames}
    />
  );
}

export function ReportsContent() {
  return (
    <Suspense fallback={<div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-6 w-24 bg-slate-200 rounded mb-4 animate-pulse" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>}>
      <ReportsServer />
    </Suspense>
  );
}
