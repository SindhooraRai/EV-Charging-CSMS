import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { toast } from "sonner";
import { Plus, CreditCard, Shield, ToggleLeft, ToggleRight, DollarSign } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/rfid")({
    head: () => ({ meta: [{ title: "RFID Cards · VoltGrid Admin" }] }),
    component: AdminRFID,
});

type RFIDCard = {
    id: string;
    holder: string;
    email: string;
    balance: number;
    active: boolean;
};

const initialCards: RFIDCard[] = [
    { id: "VID-881920", holder: "Aarav Sharma", email: "aarav@voltgrid.io", balance: 1250, active: true },
    { id: "VID-104928", holder: "Priya Patel", email: "priya@gmail.com", balance: 420, active: true },
    { id: "VID-773821", holder: "Rohan Das", email: "rohan@yahoo.com", balance: 0, active: false },
    { id: "VID-445892", holder: "Neha Sen", email: "neha.s@voltgrid.io", balance: 2500, active: true },
];

function AdminRFID() {
    const [cards, setCards] = useState<RFIDCard[]>(initialCards);
    const [showAddForm, setShowAddForm] = useState(false);
    const [holder, setHolder] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState(500);

    const toggleStatus = (id: string) => {
        setCards(cards.map(c => {
            if (c.id === id) {
                const nextState = !c.active;
                toast.info(nextState ? "RFID Activated" : "RFID Card Locked", {
                    description: `Card ${id} has been ${nextState ? "activated" : "disabled"}.`
                });
                return { ...c, active: nextState };
            }
            return c;
        }));
    };

    const topupBalance = (id: string, amount: number) => {
        setCards(cards.map(c => {
            if (c.id === id) {
                const newBalance = c.balance + amount;
                toast.success("Wallet Topped Up", {
                    description: `Added ₹${amount} to card ${id}. New balance is ₹${newBalance}.`
                });
                return { ...c, balance: newBalance };
            }
            return c;
        }));
    };

    const handleIssueCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!holder || !email) return;
        const randomId = `VID-${Math.floor(100000 + Math.random() * 900000)}`;
        const newCard: RFIDCard = {
            id: randomId,
            holder,
            email,
            balance,
            active: true,
        };
        setCards([newCard, ...cards]);
        toast.success("RFID Card Issued Successfully", { description: `Card matches ${randomId} for ${holder}.` });
        setHolder("");
        setEmail("");
        setShowAddForm(false);
    };

    const activeCount = cards.filter(c => c.active).length;

    return (
        <div>
            <PageHeader
                title="RFID Cards"
                subtitle="Manage secure tap-and-charge vehicle authentication."
                actions={
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 transition-all duration-205"
                    >
                        <Plus className="h-4 w-4" /> Issue RFID Card
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass rounded-2xl p-5">
                    <div className="text-xs text-muted-foreground">Total Issued Cards</div>
                    <div className="text-2xl font-bold stat mt-1">{cards.length}</div>
                </div>
                <div className="glass rounded-2xl p-5">
                    <div className="text-xs text-muted-foreground">Active Cards</div>
                    <div className="text-2xl font-bold stat mt-1 text-teal-500">{activeCount}</div>
                </div>
                <div className="glass rounded-2xl p-5">
                    <div className="text-xs text-muted-foreground">Locked/Disabled</div>
                    <div className="text-2xl font-bold stat mt-1 text-muted-foreground">{cards.length - activeCount}</div>
                </div>
            </div>

            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6 mb-6 max-w-xl"
                >
                    <h3 className="text-sm font-semibold mb-4">Issue New RFID Card</h3>
                    <form onSubmit={handleIssueCard} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Holder Name</label>
                                <input
                                    type="text"
                                    value={holder}
                                    onChange={(e) => setHolder(e.target.value)}
                                    placeholder="e.g. Aarav Sharma"
                                    required
                                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Holder Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Initial Wallet Load (₹)</label>
                            <input
                                type="number"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                                min="0"
                                required
                                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs hover:bg-card/45"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-95"
                            >
                                Issue Card
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid gap-6">
                <DataTable
                    rows={cards}
                    columns={[
                        {
                            key: "id",
                            header: "Card Token",
                            render: (r) => (
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="stat font-medium">{r.id}</span>
                                </div>
                            ),
                        },
                        {
                            key: "holder",
                            header: "Holder",
                            render: (r) => (
                                <div>
                                    <div className="font-semibold text-sm">{r.holder}</div>
                                    <div className="text-xs text-muted-foreground">{r.email}</div>
                                </div>
                            ),
                        },
                        {
                            key: "balance",
                            header: "Wallet Balance",
                            render: (r) => <span className="stat font-semibold">₹{r.balance.toLocaleString()}</span>,
                        },
                        {
                            key: "active",
                            header: "Status",
                            render: (r) => (
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.active ? "bg-teal-500/10 text-teal-500" : "bg-danger/10 text-danger"}`}
                                >
                                    <Shield className="h-2.5 w-2.5" /> {r.active ? "Active" : "Locked"}
                                </span>
                            ),
                        },
                        {
                            key: "actions",
                            header: "Actions",
                            className: "w-[240px]",
                            render: (r) => (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleStatus(r.id)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 text-xs hover:bg-card transition-all"
                                    >
                                        {r.active ? (
                                            <>
                                                <ToggleRight className="h-4 w-4 text-teal-500" /> Lock Card
                                            </>
                                        ) : (
                                            <>
                                                <ToggleLeft className="h-4 w-4 text-muted-foreground" /> Unlock
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => topupBalance(r.id, 500)}
                                        disabled={!r.active}
                                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary px-2 py-1 text-xs font-medium hover:bg-primary/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <DollarSign className="h-3 w-3" /> +₹500
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
}
