import { createFileRoute } from "@tanstack/react-router";
import { Radio, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { rfidCards } from "@/lib/mock";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/rfid")({
  head: () => ({ meta: [{ title: "RFID cards · VoltGrid" }] }),
  component: RFIDPage,
});

function RFIDPage() {
  return (
    <div>
      <PageHeader title="RFID cards" subtitle="Tap-and-charge across the network."
        actions={<button onClick={() => toast.success("Add card started")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Add card</button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rfidCards.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-2xl p-6 text-white shadow-[var(--shadow-card)]"
            style={{ background: c.active ? "linear-gradient(135deg, oklch(0.586 0.222 264.05), oklch(0.72 0.164 160.6))" : "linear-gradient(135deg, oklch(0.32 0.03 260), oklch(0.24 0.03 260))" }}>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest opacity-80">{c.label}</span>
              <Radio className="h-5 w-5 opacity-80" />
            </div>
            <div className="mt-8 text-lg stat tracking-widest">{c.id}</div>
            <div className="mt-4 flex justify-between items-end">
              <div>
                <div className="text-xs opacity-70">Balance</div>
                <div className="text-2xl font-semibold stat">₹{c.balance.toLocaleString()}</div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${c.active ? "bg-white/20" : "bg-white/10"}`}>{c.active ? "Active" : "Disabled"}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
