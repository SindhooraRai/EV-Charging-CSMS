import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Filter, MapPin, Navigation, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { stations, type Station } from "@/lib/mock";

export const Route = createFileRoute("/app/map")({
  head: () => ({ meta: [{ title: "Nearby chargers · VoltGrid" }] }),
  component: MapPage,
});

type Filt = "all" | "online" | "charging" | "fault";

function MapPage() {
  const [filter, setFilter] = useState<Filt>("all");
  const [selected, setSelected] = useState<Station | null>(stations[0]);
  const [q, setQ] = useState("");

  const filtered = stations.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (q && !`${s.name} ${s.city} ${s.address}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader title="Nearby chargers" subtitle="Find and start a session at any station in our network." />

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* Filters + list */}
        <div className="glass rounded-2xl p-4 h-[calc(100vh-14rem)] flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search location or station…"
              className="w-full h-10 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="mt-3 flex gap-1 text-xs">
            {(["all", "online", "charging", "fault"] as Filt[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 rounded-md py-1.5 capitalize border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.map((s) => (
              <button key={s.id} onClick={() => setSelected(s)}
                className={`w-full text-left rounded-xl border p-3 transition ${selected?.id === s.id ? "border-primary bg-primary/10" : "border-border bg-surface/60 hover:bg-card/60"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{s.name}</div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.address} · {s.city}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="stat">{s.power} kW</span>
                  <span>·</span>
                  <span>{s.connectors} connectors</span>
                  <span>·</span>
                  <span className="stat">₹{s.price}/kWh</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <div className="text-center text-sm text-muted-foreground py-10">No stations match your filters.</div>}
          </div>
        </div>

        {/* Fake map surface */}
        <div className="relative glass rounded-2xl overflow-hidden h-[calc(100vh-14rem)]">
          <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.08)_1px,transparent_0)] [background-size:36px_36px]" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, oklch(0.586 0.222 264.05 / 0.2), transparent 60%), radial-gradient(ellipse at 70% 60%, oklch(0.72 0.164 160.6 / 0.15), transparent 60%)" }} />
          {/* Pins */}
          {filtered.map((s, i) => {
            const x = 10 + ((i * 37) % 80);
            const y = 12 + ((i * 51) % 76);
            const color = s.status === "charging" ? "bg-primary" : s.status === "online" ? "bg-secondary" : s.status === "fault" ? "bg-danger" : "bg-muted-foreground";
            return (
              <button key={s.id} onClick={() => setSelected(s)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group">
                <span className={`block h-3 w-3 rounded-full ${color} ring-4 ring-background animate-pulse-ring`} />
                <span className="absolute left-1/2 -translate-x-1/2 top-4 whitespace-nowrap rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium border border-border opacity-0 group-hover:opacity-100 transition">{s.name}</span>
              </button>
            );
          })}
          {/* Toolbar */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="rounded-lg border border-border bg-surface/90 backdrop-blur px-3 py-2 text-xs inline-flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5" /> My location</button>
            <button className="rounded-lg border border-border bg-surface/90 backdrop-blur px-3 py-2 text-xs inline-flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> Layers</button>
          </div>
          {/* Details card */}
          {selected && (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{selected.name}</div>
                  <div className="text-xs text-muted-foreground">{selected.address}, {selected.city}</div>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg border border-border bg-surface/60 p-2"><div className="stat text-sm">{selected.power}</div><div className="text-muted-foreground">kW max</div></div>
                <div className="rounded-lg border border-border bg-surface/60 p-2"><div className="stat text-sm">{selected.connectors}</div><div className="text-muted-foreground">Connectors</div></div>
                <div className="rounded-lg border border-border bg-surface/60 p-2"><div className="stat text-sm">₹{selected.price}</div><div className="text-muted-foreground">Per kWh</div></div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => toast.success("Charging starting…", { description: `Session initiated at ${selected.name}` })}
                  className="flex-1 h-10 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-95"
                >Start charging</button>
                <button className="h-10 rounded-lg border border-border bg-surface px-3 text-sm hover:bg-card"><MapPin className="h-4 w-4" /></button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
