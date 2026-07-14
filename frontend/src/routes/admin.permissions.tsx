import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/admin/permissions")({
  head: () => ({ meta: [{ title: "Permissions · VoltGrid Admin" }] }),
  component: Permissions,
});
const perms = ["stations.read", "stations.write", "stations.remote_control", "sessions.read", "sessions.stop", "users.read", "users.write", "payments.read", "payments.refund", "reports.export", "audit.read", "settings.write"];
function Permissions() {
  return (
    <div>
      <PageHeader title="Permissions" subtitle="Granular capability mapping per role." />
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Permission</th>
              <th className="px-4 py-3">Super admin</th>
              <th className="px-4 py-3">Operator admin</th>
              <th className="px-4 py-3">Support</th>
              <th className="px-4 py-3">Auditor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {perms.map((p, i) => (
              <tr key={p}>
                <td className="px-4 py-3 stat text-xs">{p}</td>
                {[true, i < 8, p.includes("read") || p === "sessions.stop", p.includes("read")].map((v, j) => (
                  <td key={j} className="px-4 py-3 text-center">{v ? <span className="text-success">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
