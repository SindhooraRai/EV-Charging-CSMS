import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { toast } from "sonner";
import { Plus, Zap, Clock, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/pricing")({
    head: () => ({ meta: [{ title: "Pricing & Tariffs · VoltGrid Admin" }] }),
    component: AdminPricing,
});

type Tariff = {
    id: string;
    name: string;
    baseRate: number; // ₹/kWh
    peakRate: number; // ₹/kWh
    idleFee: number; // ₹/min
    type: "AC" | "DC";
};

const initialTariffs: Tariff[] = [
    { id: "TRF-001", name: "Standard AC Rate", baseRate: 15, peakRate: 18, idleFee: 2, type: "AC" },
    { id: "TRF-002", name: "Fast DC Rate", baseRate: 22, peakRate: 26, idleFee: 5, type: "DC" },
    { id: "TRF-003", name: "Ultra Fast Charging", baseRate: 28, peakRate: 32, idleFee: 8, type: "DC" },
    { id: "TRF-04", name: "Night Saver Tariff", baseRate: 12, peakRate: 14, idleFee: 1, type: "AC" },
];

function AdminPricing() {
    const [tariffs, setTariffs] = useState<Tariff[]>(initialTariffs);
    const [showAddForm, setShowAddForm] = useState(false);
    const [name, setName] = useState("");
    const [baseRate, setBaseRate] = useState(18);
    const [peakRate, setPeakRate] = useState(21);
    const [idleFee, setIdleFee] = useState(3);
    const [type, setType] = useState<"AC" | "DC">("AC");

    const handleAddTariff = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        const newTariff: Tariff = {
            id: `TRF-0${tariffs.length + 1}`,
            name,
            baseRate,
            peakRate,
            idleFee,
            type,
        };
        setTariffs([...tariffs, newTariff]);
        toast.success("New Tariff Created", { description: `${name} has been added.` });
        setName("");
        setShowAddForm(false);
    };

    return (
        <div>
            <PageHeader
                title="Pricing & Tariffs"
                subtitle="Manage structural price rules and charging tariffs."
                actions={
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition-all duration-200"
                    >
                        <Plus className="h-4 w-4" /> Add Tariff
                    </button>
                }
            />

            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6 mb-6 max-w-xl"
                >
                    <h3 className="text-sm font-semibold mb-4">Create Pricing Tariff</h3>
                    <form onSubmit={handleAddTariff} className="space-y-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Tariff Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. DC Super Saver"
                                required
                                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as "AC" | "DC")}
                                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="AC">AC</option>
                                    <option value="DC">DC</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Idle Fee (₹/min)</label>
                                <input
                                    type="number"
                                    value={idleFee}
                                    onChange={(e) => setIdleFee(Number(e.target.value))}
                                    required
                                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Base Rate (₹/kWh)</label>
                                <input
                                    type="number"
                                    value={baseRate}
                                    onChange={(e) => setBaseRate(Number(e.target.value))}
                                    required
                                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Peak Rate (₹/kWh)</label>
                                <input
                                    type="number"
                                    value={peakRate}
                                    onChange={(e) => setPeakRate(Number(e.target.value))}
                                    required
                                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs hover:bg-card/40"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-95"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid gap-6">
                <DataTable
                    rows={tariffs}
                    columns={[
                        {
                            key: "id",
                            header: "ID",
                            render: (r) => <span className="stat text-muted-foreground">{r.id}</span>,
                        },
                        { key: "name", header: "Name" },
                        {
                            key: "type",
                            header: "Type",
                            render: (r) => (
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.type === "DC" ? "bg-amber-500/10 text-amber-500" : "bg-teal-500/10 text-teal-500"}`}
                                >
                                    <Zap className="h-2.5 w-2.5" /> {r.type}
                                </span>
                            ),
                        },
                        {
                            key: "baseRate",
                            header: "Base Rate",
                            render: (r) => <span className="stat font-semibold">₹{r.baseRate}/kWh</span>,
                        },
                        {
                            key: "peakRate",
                            header: "Peak Rate (Hour)",
                            render: (r) => (
                                <span className="stat text-amber-500 font-semibold">₹{r.peakRate}/kWh</span>
                            ),
                        },
                        {
                            key: "idleFee",
                            header: "Idle Fee",
                            render: (r) => (
                                <span className="stat flex items-center gap-1 text-muted-foreground text-xs">
                                    <Clock className="h-3.5 w-3.5" /> ₹{r.idleFee}/min after full charge
                                </span>
                            ),
                        },
                    ]}
                />

                <div className="glass rounded-2xl p-5 flex gap-4 items-start max-w-xl">
                    <div className="h-10 w-10 min-w-10 rounded-xl bg-warning/15 text-warning grid place-items-center">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Dynamic & Peak Pricing Hours</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Peak rate tariff tier is applied automatically per region during top grid usage hours (5:00 PM – 10:00 PM local time). Configure these times inside region settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
