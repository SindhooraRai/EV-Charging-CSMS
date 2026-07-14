import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { alerts } from "@/lib/mock";

export const Route = createFileRoute("/admin/faults")({
  head: () => ({ meta: [{ title: "Fault reports · VoltGrid Admin" }] }),
  component: Faults,
});
function Faults() {
  return (
    <div>
      <PageHeader title="Fault reports" subtitle="Platform-wide fault visibility." />
      <div className="grid gap-3">
        {alerts.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className={`h-11 w-11 rounded-xl grid place-items-center ${a.severity === "critical" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">{a.message}</div>
                <StatusBadge status={a.severity} />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.station} · <span className="stat">{a.code}</span> · {a.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
