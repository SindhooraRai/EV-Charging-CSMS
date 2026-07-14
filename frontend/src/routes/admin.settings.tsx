import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Platform settings · VoltGrid Admin" }] }),
  component: AdminSettings,
});
function AdminSettings() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="Platform settings" subtitle="Global configuration and feature flags." />
      <div className="space-y-4">
        {["Branding", "Billing", "OCPP", "Feature flags", "Security", "Regions"].map((s) => (
          <div key={s} className="glass rounded-2xl p-5">
            <div className="text-sm font-semibold">{s}</div>
            <p className="text-xs text-muted-foreground">Configure {s.toLowerCase()} across the platform.</p>
            <button onClick={() => toast.success(s + " saved")} className="mt-3 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs hover:bg-card">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
}
