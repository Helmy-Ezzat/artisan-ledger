"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { useState } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarProvider onSidebarOpen={() => setIsSidebarOpen(true)}>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 flex">
        {/* Main Content */}
        <div className="flex-1 lg:pr-72">
          {children}
        </div>
        
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </SidebarProvider>
  );
}
