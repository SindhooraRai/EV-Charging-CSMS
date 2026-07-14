import React, { useState } from "react";
import { Search, Download, Calendar, DollarSign } from "lucide-react";

export default function AdminTransactions() {
    const [search, setSearch] = useState("");
    const [txns, setTxns] = useState([
        { id: "TXN-82736", user: "driver@voltgrid.com", station: "Connaught Place Supercharger", date: "Jul 13, 2026", energy: "32.4 kWh", amount: "$14.20", paymentMethod: "Credit Card (x4209)", fee: "$1.50", status: "Settled" },
        { id: "TXN-82012", user: "amit.sharma@gmail.com", station: "Airport Terminal 3 Hub", date: "Jul 11, 2526", energy: "44.1 kWh", amount: "$18.50", paymentMethod: "Wallet Balance", fee: "$0.00", status: "Settled" },
        { id: "TXN-81190", user: "driver@voltgrid.com", station: "Mall of India Level 2 Charging", date: "Jul 08, 2026", energy: "20.2 kWh", amount: "$9.80", paymentMethod: "Credit Card (x4209)", fee: "$0.50", status: "Settled" },
        { id: "TXN-79402", user: "sarah@cyberdyne.io", station: "Vasant Kunj Community Charger", date: "Jun 30, 2026", energy: "15.8 kWh", amount: "$5.90", paymentMethod: "Direct Bank Link", fee: "$0.00", status: "Refunded" },
    ]);

    const filtered = txns.filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financial Transaction Ledger</h1>
                    <p className="text-muted-foreground text-sm">Audit user charging payments, merchant commission logs, and gateway details.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Export Ledger (CSV)
                    </button>
                </div>
            </div>

            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-lg">
                {/* Actions bar */}
                <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-muted/10">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search txn ID or driver email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-card w-full border border-border rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Ledger table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                <th className="p-4">Transaction Ref</th>
                                <th className="p-4">User Account</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Energy</th>
                                <th className="p-4 text-right">Utility Fee</th>
                                <th className="p-4 text-right">Total Charged</th>
                                <th className="p-4">Settlement Info</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filtered.map((t) => (
                                <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-4 font-mono text-xs font-semibold">{t.id}</td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{t.user}</td>
                                    <td className="p-4 font-semibold">{t.station}</td>
                                    <td className="p-4 text-muted-foreground">{t.date}</td>
                                    <td className="p-4 font-semibold">{t.energy}</td>
                                    <td className="p-4 text-right text-muted-foreground">{t.fee}</td>
                                    <td className="p-4 text-right font-extrabold text-foreground">{t.amount}</td>
                                    <td className="p-4 text-xs text-muted-foreground">{t.paymentMethod}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${t.status === "Settled"
                                                ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-550 border border-amber-500/20"
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
