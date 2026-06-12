"use client";

import { useState } from "react";
import { WorkSessionForm } from "@/components/forms/WorkSessionForm";
import { PaymentForm } from "@/components/forms/PaymentForm";

export default function CombinedRecordClient({ clientNames }: { clientNames: string[] }) {
  const [activeTab, setActiveTab] = useState<"work" | "payment">("work");

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab("work")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition border-2 ${
            activeTab === "work"
              ? "bg-sky-600 text-white border-sky-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          يوم عمل
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition border-2 ${
            activeTab === "payment"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          دفعة
        </button>
      </div>

      {/* Content */}
      {activeTab === "work" ? (
        <WorkSessionForm clientNames={clientNames} />
      ) : (
        <PaymentForm clientNames={clientNames} />
      )}
    </>
  );
}
