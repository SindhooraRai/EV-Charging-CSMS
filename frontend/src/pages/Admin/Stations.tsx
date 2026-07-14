import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Radio, Zap, ArrowRight, ShieldAlert, Cpu } from "lucide-react";

export default function AdminStations() {
    const [search, setSearch] = useState("");
    const [stations, setStations] = useState([
        { id: 1, name: "Connaught Place Supercharger Hub", status: "Online", power: "150 kW", sockets: "3/4 active", ip: "192.168.1.42", firmware: "v2.0.4" },
        { id: 2, name: "Mall of India Level 2 Charging", status: "Online", power: "22 kW", sockets: "0/8 active", ip: "192.168.1.109", firmware: "v1.8.9" },
        { id: 3, name: "Airport Terminal 3 Hub", status: "Online", power: "350 kW", sockets: "6/6 active", ip: "10.0.4.15", firmware: "v2.1.0" },
        { id: 4, name: "Vasant Kunj Community Charger", status: "Offline", power: "7.4 kW", sockets: "Offline", ip: "192.168.10.8", firmware: "v1.7.0" }
    ]);

    const triggerReset = (name: string) => {
        alert(`Diagnostics Command Dispatched: Remote OCCP Hard Reset triggered on "${name}".`);
    };

    const filtered = stations.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Charging Station Nodes</h1>
                    <p className="text-muted-foreground text-sm">Monitor live OCPP connections, reboot hardware, and modify active pricing maps.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5 self-start">
                    <Plus className="h-4 w-4" /> Add Charging Station
                </button>
            </div>

            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-lg">
                {/* Actions Bar */}
                <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-muted/10">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search station node..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-card w-full border border-border rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Station list table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                <th className="p-4">Station ID / Name</th>
                                <th className="p-4">OCPP Status</th>
                                <th className="p-4">Max Output Speed</th>
                                <th className="p-4">Active Socket Ratio</th>
                                <th className="p-4 font-mono">IPv4 Address</th>
                                <th className="p-4">Firmware</th>
                                <th className="p-4 text-right">Diagnostic Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-4">
                                        <div>
                                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                                                <Link to={`/admin/stations/${s.id}`} className="hover:underline flex items-center gap-1">
                                                    {s.name} <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                </Link>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Node identifier: volt-cs-{s.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.status === "Online"
                                                ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                                                : "bg-destructive/10 text-destructive border border-destructive/20"
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-primary">{s.power}</td>
                                    <td className="p-4 font-semibold">{s.sockets}</td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{s.ip}</td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{s.firmware}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => triggerReset(s.name)}
                                            className="px-2.5 py-1 text-xs border border-border bg-card hover:bg-muted font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                                        >
                                            <Cpu className="h-3 w-3" /> Hard Reset
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
