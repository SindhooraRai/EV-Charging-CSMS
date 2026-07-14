import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { AreaCard, BarCard } from "@/components/shared/charts";
import { hourlyUsage, revenueSeries } from "@/lib/mock";

export const Route = createFileRoute("/admin/revenue")({
  head: () => ({ meta: [{ title: "Revenue · VoltGrid Admin" }] }),
  component: Rev,
});
function Rev() {
  return (
    <div>
      <PageHeader title="Revenue" subtitle="Platform revenue breakdown." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Today" value="₹8.4L" delta={12} icon={IndianRupee} />
        <KpiCard label="This month" value="₹1.24 Cr" delta={18} icon={IndianRupee} tone="secondary" />
        <KpiCard label="Quarter" value="₹4.1 Cr" delta={22} icon={IndianRupee} tone="warning" />
        <KpiCard label="YTD" value="₹14.6 Cr" delta={26} icon={IndianRupee} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AreaCard title="Revenue trend" data={revenueSeries} />
        <BarCard title="Revenue by hour" data={hourlyUsage} />
      </div>
    </div>
  );
}
