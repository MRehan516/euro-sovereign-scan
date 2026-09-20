import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  ScanLine,
  BadgeCheck,
  Calculator,
  BookOpen,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/scan", label: "Run a Scan", icon: ScanLine },
  { to: "/certificate", label: "My Certificate", icon: BadgeCheck },
  { to: "/scoring", label: "How Scoring Works", icon: Calculator },
  { to: "/about", label: "About", icon: BookOpen },
  { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[68px] flex-col border-r border-border bg-surface lg:w-64">
        <div className="flex items-center gap-3 border-b border-border px-4 py-5 lg:px-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Landmark className="size-4" />
          </span>
          <span className="hidden lg:block">
            <span className="block font-display text-[19px] leading-tight font-semibold text-foreground">
              SovereignGate
            </span>
            <span className="block text-meta text-muted-foreground">Digital sovereignty assurance</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2 lg:p-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                title={label}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="hidden lg:inline">{label}</span>
                {active ? (
                  <span className="ml-auto hidden h-4 w-[3px] rounded-full bg-accent lg:block" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-border px-6 py-4 text-meta text-muted-foreground lg:block">
          Decision support for European teams. Not legal advice.
        </div>
      </aside>

      <div className="pl-[68px] lg:pl-64">{children}</div>
    </div>
  );
}
