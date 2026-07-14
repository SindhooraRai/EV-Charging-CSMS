import React from "react";
import { History, Download, Search, Calendar } from "lucide-react";

export default function ChargingHistory() {
    const sessions = [
        { id: "TXN-82736", loc: "Connaught Place Supercharger Hub", date: "Jul 13, 2026", duration: "00:46:12", kwh: "32.4 kWh", cost: "$14.20", status: "Settled" },
        { id: "TXN-82012", loc: "Airport Terminal 3 Hub", date: "Jul 11, 2026", duration: "00:58:33", kwh: "44.1 kWh", cost: "$18.50", status: "Settled" },
        { id: "TXN-81190", loc: "Mall of India Level 2 Charging", date: "Jul 08, 2026", duration: "01:22:10", kwh: "20.2 kWh", cost: "$9.80", status: "Settled" },
        { id: "TXN-79402", loc: "Vasant Kunj Community Charger", date: "Jun 30, 2026", duration: "02:10:05", kwh: "15.8 kWh", cost: "$5.90", status: "Refunded" },
        { id: "TXN-78921", loc: "Connaught Place Supercharger Hub", date: "Jun 28, 2026", duration: "00:35:50", kwh: "28.0 kWh", cost: "$11.35", status: "Settled" }
    ];

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Charging History</h1>
                <p className="text-muted-foreground text-sm">View details, print receipts and analyze your historical EV charge logs.</p>
            </div>

            {/* Transaction Log Table */}
            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-muted/10">
                    <div className="font-semibold text-sm">Transaction Logs</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" /> Date Range
                        </button>
                        <button className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5">
                            <Download className="h-3.5 w-3.5" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                <th className="p-4">Transaction ID</th>
                                <th className="p-4">Station Location</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Energy</th>
                                <th className="p-4">Cost</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {sessions.map((s) => (
                                <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-4 font-mono text-xs font-semibold">{s.id}</td>
                                    <td className="p-4 font-semibold">{s.loc}</td>
                                    <td className="p-4 text-muted-foreground">{s.date}</td>
                                    <td className="p-4 text-muted-foreground">{s.duration}</td>
                                    <td className="p-4 font-semibold text-primary">{s.kwh}</td>
                                    <td className="p-4 font-bold">{s.cost}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.status === "Settled"
                                                ? "bg-emerald-500/10 text-emerald-450"
                                                : "bg-amber-500/10 text-amber-550"
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="p-1 px-2.5 bg-muted border border-border hover:bg-border rounded text-xs font-medium inline-flex items-center gap-1 transition-colors">
                                            <Download className="h-3 w-3" /> PDF
                                        </button>
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
