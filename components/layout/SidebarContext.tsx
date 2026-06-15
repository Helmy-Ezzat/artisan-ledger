"use client";

import { createContext, useContext } from "react";

interface SidebarContextType {
  onSidebarOpen: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  onSidebarOpen,
}: {
  children: React.ReactNode;
  onSidebarOpen: () => void;
}) {
  return (
    <SidebarContext.Provider value={{ onSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
