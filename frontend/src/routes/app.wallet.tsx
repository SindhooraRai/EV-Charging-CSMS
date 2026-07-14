import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { AreaCard } from "@/components/shared/charts";
import { revenueSeries, transactions } from "@/lib/mock";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";

export const Route = createFileRoute("/app/wallet")({
  head: () => ({ meta: [{ title: "Wallet · VoltGrid" }] }),
  component: WalletPage,
});

function WalletPage() {
  return (
    <div>
      <PageHeader title="Wallet" subtitle="Top up once, drive stress-free." />
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 text-white shadow-[var(--shadow-elevated)]"
          style={{ background: "linear-gradient(135deg, oklch(0.586 0.222 264.05), oklch(0.32 0.24 264))" }}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-2 text-xs opacity-80"><WalletIcon className="h-4 w-4" /> VoltGrid Balance</div>
          <div className="mt-4 text-4xl font-semibold stat">₹1,240.<span className="text-2xl">50</span></div>
          <div className="mt-2 text-xs opacity-80">Available across all stations</div>
          <button onClick={() => toast.success("Top-up initiated")} className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur px-3 py-1.5 text-sm hover:bg-white/30"><Plus className="h-4 w-4" /> Add money</button>
        </motion.div>
        <div className="lg:col-span-2">
          <AreaCard title="Spending" subtitle="Last 30 days" data={revenueSeries} dataKey="revenue" />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 text-sm font-semibold">Recent transactions</div>
        <DataTable
          rows={transactions}
          columns={[
            { key: "id", header: "Txn", render: (r) => <span className="stat text-muted-foreground">{r.id}</span> },
            { key: "date", header: "Date" },
            { key: "station", header: "Station" },
            { key: "method", header: "Method" },
            { key: "amount", header: "Amount", render: (r) => <span className="stat">₹{r.amount}</span> },
            { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
          ]}
        />
      </div>
    </div>
  );
}
