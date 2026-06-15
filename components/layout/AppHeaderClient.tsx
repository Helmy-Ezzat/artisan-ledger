"use client";

import { useSidebar } from "./SidebarContext";
import { AppHeader } from "./AppHeader";

interface AppHeaderClientProps {
  title: string;
  subtitle?: string;
  user: {
    email?: string | null;
    user_metadata: {
      avatar_url?: string | null;
      full_name?: string | null;
    };
  };
}

export function AppHeaderClient({ title, subtitle, user }: AppHeaderClientProps) {
  const { onSidebarOpen } = useSidebar();

  return (
    <AppHeader
      title={title}
      subtitle={subtitle}
      user={user}
      onSidebarOpen={onSidebarOpen}
    />
  );
}
