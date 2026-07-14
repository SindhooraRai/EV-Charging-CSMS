import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Battery, Zap, IndianRupee, Leaf, MapPin } from "lucide-react";
import { KpiCard } from "@/components/shared/kpi-card";
import { PageHeader } from "@/components/shared/page-header";
import { AreaCard, BarCard } from "@/components/shared/charts";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { hourlyUsage, revenueSeries, sessions, stations } from "@/lib/mock";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · VoltGrid Driver" }] }),
  component: UserDashboard,
});

function UserDashboard() {
  return (
    <div>
      <PageHeader title="Good afternoon, Aarav" subtitle="Here's your charging overview for this week." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Energy this month" value="128.4 kWh" delta={12} icon={Zap} tone="primary" index={0} />
        <KpiCard label="Amount spent" value="₹4,820" delta={-6} icon={IndianRupee} tone="secondary" index={1} />
        <KpiCard label="Sessions" value="14" delta={8} icon={Battery} tone="warning" index={2} />
        <KpiCard label="CO₂ avoided" value="84 kg" delta={9} icon={Leaf} tone="secondary" index={3} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaCard title="Energy consumed" subtitle="Last 30 days" data={revenueSeries} dataKey="energy" color="var(--secondary)" />
        </div>
        <div>
          <BarCard title="Peak hours" subtitle="Your typical charging pattern" data={hourlyUsage} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Recent sessions</div>
              <div className="text-xs text-muted-foreground">Your last 6 charges</div>
            </div>
            <Link to="/app/history" className="text-xs text-primary-glow hover:underline">View all</Link>
          </div>
          <div className="mt-4 -mx-5">
            <DataTable
              rows={sessions.slice(0, 5)}
              columns={[
                { key: "id", header: "ID", render: (r) => <span className="stat text-muted-foreground">{r.id}</span> },
                { key: "station", header: "Station" },
                { key: "energy", header: "Energy", render: (r) => <span className="stat">{r.energy} kWh</span> },
                { key: "cost", header: "Cost", render: (r) => <span className="stat">₹{r.cost}</span> },
                { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
              ]}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold">Nearby chargers</div>
          <div className="text-xs text-muted-foreground">Live availability</div>
          <ul className="mt-4 space-y-3">
            {stations.slice(0, 4).map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-3 hover:bg-card/60 transition">
                <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center text-primary-glow"><MapPin className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.address}</div>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
          <Link to="/app/map" className="mt-4 inline-flex text-xs text-primary-glow hover:underline">Open map →</Link>
        </motion.div>
      </div>
    </div>
  );
}
