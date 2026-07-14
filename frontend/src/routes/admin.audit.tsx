import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({ meta: [{ title: "Audit logs · VoltGrid Admin" }] }),
  component: Audit,
});
const events = [
  { t: "10:24:12", user: "meera@voltgrid.io", action: "station.remote_start", target: "STN-001" },
  { t: "10:22:04", user: "ravi@voltgrid.io", action: "role.grant", target: "u_1029 → operator_admin" },
  { t: "10:18:33", user: "meera@voltgrid.io", action: "pricing.update", target: "peak_evening → ₹24" },
  { t: "10:12:11", user: "system", action: "firmware.rollout", target: "24 stations" },
  { t: "09:58:20", user: "ravi@voltgrid.io", action: "operator.suspend", target: "OP-04" },
];
function Audit() {
  return (
    <div>
      <PageHeader title="Audit logs" subtitle="Immutable record of every privileged action." />
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Time</th><th className="px-4 py-3 text-left">Actor</th><th className="px-4 py-3 text-left">Action</th><th className="px-4 py-3 text-left">Target</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((e, i) => (
              <tr key={i}>
                <td className="px-4 py-3 stat text-xs">{e.t}</td>
                <td className="px-4 py-3">{e.user}</td>
                <td className="px-4 py-3 stat text-xs">{e.action}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
