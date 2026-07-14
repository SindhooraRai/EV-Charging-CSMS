import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronsLeft, LogOut, Search, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string; icon: LucideIcon; badge?: string };
export type NavGroup = { label: string; items: NavItem[] };

export function PortalShell({
  brand,
  nav,
  children,
  accent = "primary",
}: {
  brand: string;
  nav: NavGroup[];
  children: ReactNode;
  accent?: "primary" | "secondary" | "warning";
}) {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const accentClasses = {
    primary: "from-primary to-primary-glow",
    secondary: "from-secondary to-primary",
    warning: "from-warning to-primary",
  }[accent];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen shrink-0 border-r border-border bg-sidebar transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
          <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-br grid place-items-center text-white shadow-lg", accentClasses)}>
            <Zap className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <div className="text-sm font-semibold font-[family-name:var(--font-display)] leading-tight">VoltGrid</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{brand}</div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            <ChevronsLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          {nav.map((group) => (
            <div key={group.label}>
              {!sidebarCollapsed && (
                <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">{group.label}</div>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(item.to + "/");
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-primary/15 text-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary-glow")} />
                        {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!sidebarCollapsed && item.badge && (
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary-glow">
                            {item.badge}
                          </span>
                        )}
                        {active && !sidebarCollapsed && (
                          <motion.span layoutId="active-pill" className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center text-xs font-semibold text-white">
              {user?.avatar ?? "??"}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.name ?? "Guest"}</div>
                <div className="text-[11px] text-muted-foreground truncate">{user?.email ?? ""}</div>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={() => { logout(); toast.success("Signed out"); window.location.href = "/"; }}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/70 backdrop-blur-xl flex items-center gap-3 px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search stations, sessions, users…"
              className="w-full h-9 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => toast("2 unread alerts", { description: "1 fault at BKC Tower, 1 firmware complete" })}
              className="relative rounded-lg border border-border bg-surface p-2 hover:bg-card"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger animate-pulse" />
            </button>
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
