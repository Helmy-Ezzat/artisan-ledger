import { createClient } from "@/lib/supabase";
import { AppHeaderClient } from "./AppHeaderClient";

interface AppHeaderServerProps {
  title: string;
  subtitle?: string;
}

export async function AppHeaderServer({ title, subtitle }: AppHeaderServerProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <AppHeaderClient
      title={title}
      subtitle={subtitle}
      user={{
        email: user.email,
        user_metadata: {
          avatar_url: user.user_metadata?.avatar_url || null,
          full_name: user.user_metadata?.full_name || null,
        },
      }}
    />
  );
}
