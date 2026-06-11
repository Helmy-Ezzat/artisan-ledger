import { Hammer } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-md shadow-teal-600/20">
          <Hammer className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          {subtitle ? (
            <p className="text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
