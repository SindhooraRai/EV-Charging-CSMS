import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { platformUsers } from "@/lib/mock";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users · VoltGrid Admin" }] }),
  component: AdminUsers,
});
function AdminUsers() {
  return (
    <div>
      <PageHeader title="Users" subtitle="All drivers registered on VoltGrid." />
      <DataTable rows={platformUsers} columns={[
        { key: "id", header: "ID", render: (r) => <span className="stat text-muted-foreground">{r.id}</span> },
        { key: "name", header: "Name" },
        { key: "email", header: "Email", render: (r) => <span className="text-muted-foreground">{r.email}</span> },
        { key: "sessions", header: "Sessions", render: (r) => <span className="stat">{r.sessions}</span> },
        { key: "spent", header: "Spent", render: (r) => <span className="stat">₹{r.spent.toLocaleString()}</span> },
        { key: "joined", header: "Joined" },
      ]} />
    </div>
  );
}
