import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Camera, ClipboardCheck, HardHat, Package, BarChart3, Droplets, Compass, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

const TABS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/diagnostics", label: "AI Crack", icon: Camera },
  { to: "/panorama", label: "360", icon: Compass },
  { to: "/audits", label: "Audits", icon: ClipboardCheck },
  { to: "/progress", label: "Progress", icon: BarChart3 },
] as const;

export function MobileShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-foreground/10 bg-secondary px-4 py-3 text-secondary-foreground shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-black text-primary-foreground">B</div>
          <div>
            <div className="text-xs uppercase tracking-widest opacity-70">BuildSmart AI</div>
            <h1 className="text-base font-bold leading-tight">{title}</h1>
          </div>
        </div>
        <button onClick={signOut} aria-label="Sign out" className="rounded p-2 hover:bg-white/10">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-foreground/10 bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <ul className="grid grid-cols-5">
          {TABS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function ModuleTile({
  to,
  title,
  desc,
  icon: Icon,
  tone = "primary",
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "accent" | "secondary";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-accent text-accent-foreground"
      : tone === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border-2 border-foreground/10 bg-card p-4 shadow-sm transition-all active:scale-[0.98]"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-base font-bold leading-tight">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </Link>
  );
}

export { HardHat, Package, Droplets };