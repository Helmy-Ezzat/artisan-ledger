"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { Plus } from "lucide-react";
import { WorkSessionForm } from "@/components/forms/WorkSessionForm";

interface CalendarPageClientProps {
  clientNames: string[];
}

export function CalendarPageClient({ clientNames }: CalendarPageClientProps) {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowRegisterForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5" />
          تسجيل يوم عمل
        </button>
      </div>

      <Drawer
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        title="تسجيل يوم عمل جديد"
      >
        <WorkSessionForm
          clientNames={clientNames}
          onSuccess={() => {
            setShowRegisterForm(false);
            router.refresh();
          }}
        />
      </Drawer>
    </>
  );
}
