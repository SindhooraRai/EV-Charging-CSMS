import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({ meta: [{ title: "Roles · VoltGrid Admin" }] }),
  component: Roles,
});
const roles = [
  { name: "Super admin", members: 3, desc: "Full access to all platform features." },
  { name: "Operator admin", members: 84, desc: "Manage stations and users within an operator." },
  { name: "Support agent", members: 42, desc: "Read-only access with session assistance." },
  { name: "Auditor", members: 6, desc: "Read-only access with audit log visibility." },
];
function Roles() {
  return (
    <div>
      <PageHeader title="Roles" subtitle="Role-based access control." />
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((r) => (
          <div key={r.name} className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary-glow grid place-items-center"><Shield className="h-4 w-4" /></div>
              <div>
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.members} members</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
