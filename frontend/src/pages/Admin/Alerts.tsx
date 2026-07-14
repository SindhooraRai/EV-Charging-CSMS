import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, UserCheck, Trash2, Calendar, FileCheck } from "lucide-react";

export default function AdminAlerts() {
    const [alerts, setAlerts] = useState([
        { id: 1, loc: "Station 4 - Mall of India", msg: "Connector C4 Thermal Overload (>85°C)", severity: "critical", time: "10 minutes ago", resolved: false },
        { id: 2, loc: "Station 1 - Connaught Place", msg: "Meter value signature mismatch suspect", severity: "warning", time: "32 minutes ago", resolved: false },
        { id: 3, loc: "Station 8 - Dwarka Sec 10", msg: "Unit ping packet latency > 1500ms", severity: "info", time: "1 hour ago", resolved: false },
        { id: 4, loc: "Station 12 - Airport P3", msg: "Unlock connector C2 failed retry", severity: "warning", time: "5 hours ago", resolved: true },
        { id: 5, loc: "Station 2 - Sector 62 Noida", msg: "Ground fault detector warning tripped", severity: "critical", time: "1 day ago", resolved: true }
    ]);

    const toggleResolve = (id: number) => {
        setAlerts(prev => prev.map(a => {
            if (a.id === id) {
                return { ...a, resolved: !a.resolved };
            }
            return a;
        }));
    };

    const dispatchEngineer = (loc: string) => {
        alert(`Engineer Dispatch System: Work Order generated successfully for "${loc}". Field crew dispatched.`);
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Safety & Grid Alerts Center</h1>
                    <p className="text-muted-foreground text-sm">Review real time server faults, voltage anomalies, and hardware temperature failures.</p>
                </div>
                <button
                    onClick={() => setAlerts(prev => prev.map(a => ({ ...a, resolved: true })))}
                    className="px-4 py-2 border border-border bg-card hover:bg-muted text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 self-start"
                >
                    <FileCheck className="h-4 w-4 text-emerald-450" /> Resolve All Alerts
                </button>
            </div>

            <div className="space-y-3">
                {alerts.map((a) => {
                    return (
                        <div
                            key={a.id}
                            className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${a.resolved
                                    ? "bg-card/45 border-border/80 text-muted-foreground"
                                    : "bg-card border-border/100 text-foreground"
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className={`h-10 w-10 rounded-lg shrink-0 grid place-items-center ${a.resolved
                                        ? "bg-muted text-muted-foreground"
                                        : a.severity === "critical"
                                            ? "bg-destructive/10 text-destructive animate-pulse"
                                            : a.severity === "warning"
                                                ? "bg-amber-500/10 text-amber-450"
                                                : "bg-cyan-500/10 text-cyan-450"
                                    }`}>
                                    <AlertTriangle className="h-5 w-5" />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-bold text-sm leading-tight text-foreground">{a.loc}</h4>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {a.time}
                                        </span>
                                        {!a.resolved && (
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${a.severity === "critical" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                                                }`}>
                                                {a.severity}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{a.msg}</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 self-end md:self-center shrink-0">
                                {!a.resolved && a.severity === "critical" && (
                                    <button
                                        onClick={() => dispatchEngineer(a.loc)}
                                        className="px-3 py-1.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:opacity-90 transition-all glow-primary flex items-center gap-1"
                                    >
                                        <UserCheck className="h-3.5 w-3.5" /> Dispatch Crew
                                    </button>
                                )}
                                <button
                                    onClick={() => toggleResolve(a.id)}
                                    className={`px-3 py-1.5 border text-xs font-semibold rounded-lg transition-all ${a.resolved
                                            ? "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted"
                                            : "border-emerald-500/20 bg-emerald-500/5 text-emerald-450 hover:bg-emerald-500/10"
                                        }`}
                                >
                                    {a.resolved ? "Reopen" : "Mark Resolved"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
