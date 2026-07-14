import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Timer, Battery, IndianRupee, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { AreaCard } from "@/components/shared/charts";

export const Route = createFileRoute("/app/live")({
  head: () => ({ meta: [{ title: "Live session · VoltGrid" }] }),
  component: LiveCharging,
});

function LiveCharging() {
  const [soc, setSoc] = useState(38);
  const [energy, setEnergy] = useState(12.4);
  const [minutes, setMinutes] = useState(24);
  const [series, setSeries] = useState(Array.from({ length: 20 }, (_, i) => ({ day: `${i}`, power: 80 + Math.sin(i / 2) * 30 })));

  useEffect(() => {
    const t = setInterval(() => {
      setSoc((s) => Math.min(100, s + 0.4));
      setEnergy((e) => e + 0.12);
      setMinutes((m) => m + 0.05);
      setSeries((s) => [...s.slice(1), { day: `${Number(s[s.length - 1].day) + 1}`, power: 90 + Math.sin(Date.now() / 800) * 30 + Math.random() * 8 }]);
    }, 800);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <PageHeader
        title="Live charging session"
        subtitle="Whitefield Hub · Connector C-03 · CCS2"
        actions={
          <button onClick={() => toast.error("Stop requested", { description: "The station is finalizing your session." })}
            className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-95">
            <Square className="h-4 w-4" /> Stop charging
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* Battery card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 flex flex-col items-center">
          <div className="relative w-40 h-64">
            <div className="absolute inset-x-8 -top-3 h-3 rounded-t bg-card" />
            <div className="absolute inset-0 rounded-3xl border-4 border-card overflow-hidden bg-surface">
              <motion.div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary to-primary-glow"
                animate={{ height: `${soc}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-5xl font-semibold stat text-white drop-shadow">{Math.round(soc)}%</div>
                  <div className="text-xs text-white/80 mt-1">State of charge</div>
                </div>
              </div>
              {/* Bubble effect */}
              {[0, 1, 2].map((i) => (
                <motion.span key={i}
                  className="absolute left-1/2 bottom-4 h-1.5 w-1.5 rounded-full bg-white/60"
                  style={{ marginLeft: `${(i - 1) * 12}px` }}
                  animate={{ y: [0, -120], opacity: [0, 1, 0] }}
                  transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Charging · 120 kW
          </div>
          <div className="mt-4 text-xs text-muted-foreground">Est. full in {Math.max(0, Math.round((100 - soc) * 0.6))} min</div>
        </motion.div>

        {/* Telemetry */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric label="Energy" icon={Zap} value={`${energy.toFixed(1)} kWh`} />
            <Metric label="Time" icon={Timer} value={`${Math.floor(minutes)}m ${Math.round((minutes % 1) * 60)}s`} />
            <Metric label="Power" icon={Battery} value="118.4 kW" />
            <Metric label="Cost" icon={IndianRupee} value={`₹${Math.round(energy * 18)}`} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric small label="Voltage" value="398.2 V" />
            <Metric small label="Current" value="298 A" />
            <Metric small label="Temperature" value="34°C" />
            <Metric small label="Tariff" value="₹18/kWh" />
          </div>
          <AreaCard title="Live power" subtitle="kW · updates every 800ms" data={series} dataKey="power" color="var(--primary-glow)" height={220} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon, small }: { label: string; value: string; icon?: any; small?: boolean }) {
  return (
    <div className={`glass rounded-2xl ${small ? "p-3" : "p-4"}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        {Icon && <Icon className="h-4 w-4 text-primary-glow" />}
      </div>
      <div className={`mt-1 stat ${small ? "text-lg" : "text-2xl"}`}>{value}</div>
    </div>
  );
}
