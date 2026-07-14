import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { sessions } from "@/lib/mock";

export const Route = createFileRoute("/app/history")({
  head: () => ({ meta: [{ title: "Charging history · VoltGrid" }] }),
  component: History,
});

function History() {
  return (
    <div>
      <PageHeader title="Charging history" subtitle="Every session, every receipt — always at hand."
        actions={<button onClick={() => toast.success("Export ready", { description: "history.csv is downloading" })}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-card"><Download className="h-4 w-4" /> Export CSV</button>}
      />
      <DataTable
        rows={sessions}
        columns={[
          { key: "id", header: "Session", render: (r) => <span className="stat text-muted-foreground">{r.id}</span> },
          { key: "station", header: "Station" },
          { key: "vehicle", header: "Vehicle" },
          { key: "start", header: "Started" },
          { key: "duration", header: "Duration", render: (r) => <span className="stat">{r.duration}</span> },
          { key: "energy", header: "Energy", render: (r) => <span className="stat">{r.energy} kWh</span> },
          { key: "cost", header: "Cost", render: (r) => <span className="stat">₹{r.cost}</span> },
          { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "actions", header: "", render: () => <button className="text-xs text-primary-glow hover:underline">Receipt</button> },
        ]}
      />
    </div>
  );
}
