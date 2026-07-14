import { createFileRoute } from "@tanstack/react-router";
import { Activity, Cpu, Database, Server } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { AreaCard } from "@/components/shared/charts";
import { revenueSeries } from "@/lib/mock";

export const Route = createFileRoute("/admin/health")({
  head: () => ({ meta: [{ title: "System health · VoltGrid Admin" }] }),
  component: Health,
});
function Health() {
  return (
    <div>
      <PageHeader title="System health" subtitle="Infrastructure and service-level indicators." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="API uptime" value="99.98%" delta={0} icon={Server} />
        <KpiCard label="OCPP latency" value="18 ms" delta={-4} icon={Activity} tone="secondary" />
        <KpiCard label="Database RPS" value="12.4k" delta={6} icon={Database} tone="warning" />
        <KpiCard label="Workers online" value="42/42" delta={0} icon={Cpu} />
      </div>
      <div className="mt-6"><AreaCard title="Request rate" data={revenueSeries} dataKey="sessions" /></div>
    </div>
  );
}
