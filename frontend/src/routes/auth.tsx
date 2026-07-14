import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left brand pane */}
      <div className="relative hidden md:flex flex-col justify-between p-10 overflow-hidden border-r border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.06)_1px,transparent_0)] [background-size:24px_24px]" />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-white shadow-lg">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-semibold font-[family-name:var(--font-display)]">VoltGrid</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-3xl font-semibold leading-tight">The control plane for modern EV charging networks.</h2>
          <p className="mt-4 text-muted-foreground max-w-md">Live telemetry, revenue analytics, dynamic pricing, and a delightful driver app — in one platform.</p>
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "12,480", l: "Live stations" },
              { k: "1.4M+", l: "Sessions/mo" },
              { k: "99.98%", l: "Uptime" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-semibold stat gradient-text">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-muted-foreground">© {new Date().getFullYear()} VoltGrid Inc.</div>
      </div>
      {/* Right form pane */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
