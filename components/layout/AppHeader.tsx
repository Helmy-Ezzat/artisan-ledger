"use client";

import { Menu } from "lucide-react";
import { UserButton } from "./UserButton";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  user: {
    email?: string | null;
    user_metadata: {
      avatar_url?: string | null;
      full_name?: string | null;
    };
  };
  onSidebarOpen?: () => void;
}

export function AppHeader({ title, subtitle, user, onSidebarOpen }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onSidebarOpen}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
          aria-label="فتح القائمة الجانبية"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* User Button */}
        <UserButton user={user} />
      </div>

      
    </header>
  );
}
