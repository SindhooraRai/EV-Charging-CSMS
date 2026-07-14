import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, IndianRupee, AlertTriangle, Cpu } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { notifications } from "@/lib/mock";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications · VoltGrid Admin" }] }),
  component: AdminNotifs,
});
const iconMap = { charging: Zap, payment: IndianRupee, fault: AlertTriangle, system: Cpu } as const;
const toneMap = { charging: "text-primary bg-primary/15", payment: "text-secondary bg-secondary/15", fault: "text-danger bg-danger/15", system: "text-warning bg-warning/15" } as const;
function AdminNotifs() {
  return (
    <div>
      <PageHeader title="Notifications" subtitle="Platform-level notifications." />
      <div className="glass rounded-2xl divide-y divide-border">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-4 p-5 ${!n.read ? "bg-primary/[0.04]" : ""}`}>
              <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneMap[n.type]}`}><Icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{n.body}</div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
