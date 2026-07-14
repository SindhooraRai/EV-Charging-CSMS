import { createFileRoute } from "@tanstack/react-router";
import { Building2, Briefcase, IndianRupee, Users, AlertTriangle, Activity } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { AreaCard, BarCard, DonutCard, LineCard } from "@/components/shared/charts";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { connectorMix, hourlyUsage, operators, revenueSeries } from "@/lib/mock";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Platform analytics · VoltGrid Admin" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Platform analytics" subtitle="Cross-operator visibility across the entire VoltGrid network." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Platform GMV" value="₹31.8 Cr" delta={22} icon={IndianRupee} tone="primary" />
        <KpiCard label="Operators" value="2,180" delta={5} icon={Briefcase} tone="secondary" />
        <KpiCard label="Stations" value="12,480" delta={7} icon={Building2} tone="warning" />
        <KpiCard label="Users" value="486k" delta={11} icon={Users} tone="primary" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><AreaCard title="Platform revenue" subtitle="Last 30 days" data={revenueSeries} /></div>
        <DonutCard title="Connector distribution" data={connectorMix} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BarCard title="Peak hours (network)" data={hourlyUsage} />
        <LineCard title="Sessions & energy" data={revenueSeries} />
      </div>
      <div className="mt-6">
        <div className="mb-3 text-sm font-semibold">Top operators</div>
        <DataTable
          rows={operators}
          columns={[
            { key: "id", header: "ID", render: (r) => <span className="stat text-muted-foreground">{r.id}</span> },
            { key: "name", header: "Operator" },
            { key: "region", header: "Region" },
            { key: "stations", header: "Stations", render: (r) => <span className="stat">{r.stations}</span> },
            { key: "revenue", header: "Revenue", render: (r) => <span className="stat">₹{(r.revenue / 100000).toFixed(1)}L</span> },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>
    </div>
  );
}
