import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { stations } from "@/lib/mock";

export const Route = createFileRoute("/admin/stations")({
  head: () => ({ meta: [{ title: "Stations · VoltGrid Admin" }] }),
  component: AdminStations,
});
function AdminStations() {
  return (
    <div>
      <PageHeader title="Stations" subtitle="Every station across the platform." />
      <DataTable rows={stations} columns={[
        { key: "id", header: "ID", render: (r) => <span className="stat text-muted-foreground">{r.id}</span> },
        { key: "name", header: "Name", render: (r) => <Link to="/admin/stations/$id" params={{ id: r.id }} className="font-semibold text-primary hover:underline">{r.name}</Link> },
        { key: "city", header: "City" },
        { key: "power", header: "Power", render: (r) => <span className="stat">{r.power} kW</span> },
        { key: "utilization", header: "Util.", render: (r) => <span className="stat">{r.utilization}%</span> },
        { key: "revenue", header: "Revenue", render: (r) => <span className="stat">₹{r.revenue.toLocaleString()}</span> },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]} />
    </div>
  );
}
