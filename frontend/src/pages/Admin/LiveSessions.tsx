import React, { useState } from "react";
import { Search, Radio, Ban, BatteryCharging } from "lucide-react";

export default function AdminLiveSessions() {
    const [search, setSearch] = useState("");
    const [sessions, setSessions] = useState([
        { id: "SESS-9082", station: "Connaught Place Supercharger Hub", connector: "C1", user: "driver@voltgrid.com", start: "18:10", energy: "12.45 kWh", speed: "115.4 kW", rate: "$0.35/kWh" },
        { id: "SESS-9076", station: "Connaught Place Supercharger Hub", connector: "C2", user: "amit.sharma@gmail.com", start: "17:45", energy: "28.10 kWh", speed: "74.8 kW", rate: "$0.35/kWh" },
        { id: "SESS-8991", station: "Airport Terminal 3 Hub", connector: "C1", user: "nexon_driver@outlook.com", start: "18:02", energy: "8.50 kWh", speed: "120.0 kW", rate: "$0.45/kWh" },
        { id: "SESS-8921", station: "Airport Terminal 3 Hub", connector: "C2", user: "tesla_rentDelhi@uber.com", start: "16:21", energy: "88.40 kWh", speed: "210.0 kW", rate: "$0.45/kWh" }
    ]);

    const forceStop = (id: string, user: string) => {
        const check = window.confirm(`Trigger remote transaction abort (StopTransaction.req) for Session ${id} (${user})?`);
        if (check) {
            setSessions(prev => prev.filter(s => s.id !== id));
            alert(`Aborted session ${id}. Connector unlock command dispatched.`);
        }
    };

    const filtered = sessions.filter(s => s.station.toLowerCase().includes(search.toLowerCase()) || s.user.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Active Live Sessions</h1>
                    <p className="text-muted-foreground text-sm">Monitor energy packets delivered, connection speeds, and force unlock sockets instantly.</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold">
                    <Radio className="h-3.5 w-3.5 animate-pulse" /> {sessions.length} Charging Sockets
                </span>
            </div>

            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-lg">
                {/* Search header */}
                <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-muted/10">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search user or station..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-card w-full border border-border rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Live sessions table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                <th className="p-4">Session ID</th>
                                <th className="p-4">Charging Node</th>
                                <th className="p-4 text-center">Socket</th>
                                <th className="p-4">User Account</th>
                                <th className="p-4 text-center">Started</th>
                                <th className="p-4">Delivered</th>
                                <th className="p-4">Rate (kW)</th>
                                <th className="p-4">Tariff</th>
                                <th className="p-4 text-right">Intervention</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-4 font-mono text-xs font-semibold">{s.id}</td>
                                    <td className="p-4 font-semibold">{s.station}</td>
                                    <td className="p-4 text-center"><span className="px-2 py-0.5 bg-muted border border-border rounded text-xs font-bold">{s.connector}</span></td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{s.user}</td>
                                    <td className="p-4 text-center text-muted-foreground">{s.start}</td>
                                    <td className="p-4 font-semibold text-primary">{s.energy}</td>
                                    <td className="p-4 font-bold text-emerald-450">{s.speed}</td>
                                    <td className="p-4 text-muted-foreground">{s.rate}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => forceStop(s.id, s.user)}
                                            className="px-2.5 py-1 text-xs border border-destructive/25 text-destructive bg-destructive/5 hover:bg-destructive/10 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                                        >
                                            <Ban className="h-3.5 w-3.5" /> Stop Remote
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
