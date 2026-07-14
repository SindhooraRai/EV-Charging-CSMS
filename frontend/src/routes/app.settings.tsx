import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings · VoltGrid" }] }),
  component: Settings,
});

const tabs = ["Profile", "Password", "Notifications", "Security", "API keys"] as const;

function Settings() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Profile");
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your account preferences." />
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <nav className="glass rounded-2xl p-2 h-fit">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm ${tab === t ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-card"}`}>{t}</button>
          ))}
        </nav>
        <div className="glass rounded-2xl p-6">
          <div className="text-sm font-semibold">{tab}</div>
          <p className="text-xs text-muted-foreground">Update your {tab.toLowerCase()} preferences.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Saved"); }} className="mt-6 space-y-4 max-w-lg">
            {tab === "Password" ? (
              <>
                <input type="password" placeholder="Current password" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input type="password" placeholder="New password" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input type="password" placeholder="Confirm" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </>
            ) : tab === "Notifications" ? (
              <>
                {["Charging alerts", "Payment receipts", "System notices", "Marketing emails"].map((l) => (
                  <label key={l} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                    <span>{l}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                  </label>
                ))}
              </>
            ) : tab === "API keys" ? (
              <>
                <div className="rounded-lg border border-border bg-surface p-3 text-sm">
                  <div className="flex justify-between"><span className="stat text-xs text-muted-foreground">vg_live_••••••••••••4821</span><button className="text-xs text-danger">Revoke</button></div>
                </div>
                <button className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">Generate new key</button>
              </>
            ) : (
              <>
                <input defaultValue="Aarav Sharma" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <select className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option>English</option><option>हिन्दी</option><option>தமிழ்</option>
                </select>
              </>
            )}
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
