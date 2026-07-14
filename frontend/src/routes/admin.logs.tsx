import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/admin/logs")({
  head: () => ({ meta: [{ title: "Logs · VoltGrid Admin" }] }),
  component: Logs,
});
const levels = ["INFO", "WARN", "ERROR", "INFO", "INFO", "DEBUG", "INFO", "WARN"];
function Logs() {
  return (
    <div>
      <PageHeader title="Logs" subtitle="Real-time application and OCPP logs." />
      <div className="glass rounded-2xl p-4">
        <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs space-y-1 max-h-[70vh] overflow-y-auto">
          {Array.from({ length: 60 }).map((_, i) => {
            const lvl = levels[i % levels.length];
            const tone = lvl === "ERROR" ? "text-danger" : lvl === "WARN" ? "text-warning" : lvl === "DEBUG" ? "text-muted-foreground" : "text-secondary";
            return (
              <div key={i} className="text-muted-foreground">
                <span className="text-primary-glow">[2026-07-14 10:{String(i).padStart(2, "0")}:12]</span>{" "}
                <span className={tone}>{lvl}</span>{" "}
                <span>ocpp.station.STN-00{(i % 8) + 1} heartbeat=OK power={110 + (i % 40)}kW soc={40 + (i % 60)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
