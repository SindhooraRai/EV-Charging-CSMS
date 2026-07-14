import React, { useState } from "react";
import { Bell, CheckCircle, ShieldAlert, Zap, Info, Calendar } from "lucide-react";

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "success",
            title: "Payment Settled Successfully",
            desc: "Receipt REC-82736 for $14.20 has been processed electronically. View PDF in history.",
            time: "2 hours ago",
            read: false
        },
        {
            id: 2,
            type: "info",
            title: "New Charger Installed",
            desc: "A new DC Fast 150kW unit (Station 14) is now live in Saket Area. Connectors are empty.",
            time: "1 day ago",
            read: false
        },
        {
            id: 3,
            type: "warning",
            title: "Scheduled Maintenance Alert",
            desc: "Station 4 AC connectors will be powered down for routine inspections on Jul 16 between 02:00 and 04:00 AM.",
            time: "2 days ago",
            read: true
        }
    ]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="space-y-6 font-sans max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground text-sm">Review grid status logs, reservation updates, and receipts.</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-primary hover:underline"
                >
                    Mark all as read
                </button>
            </div>

            <div className="space-y-3">
                {notifications.map((n) => {
                    return (
                        <div
                            key={n.id}
                            className={`p-4 border rounded-xl flex gap-4 transition-all relative ${n.read
                                    ? "bg-card/40 border-border text-muted-foreground"
                                    : "bg-card border-border/80 text-foreground"
                                }`}
                        >
                            {!n.read && (
                                <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-primary glow-primary"></span>
                            )}

                            {/* Type Icons */}
                            <div className={`h-10 w-10 rounded-lg shrink-0 grid place-items-center ${n.type === "success"
                                    ? "bg-emerald-500/10 text-emerald-450"
                                    : n.type === "warning"
                                        ? "bg-amber-500/10 text-amber-450"
                                        : "bg-cyan-500/10 text-cyan-450"
                                }`}>
                                {n.type === "success" && <CheckCircle className="h-5 w-5" />}
                                {n.type === "warning" && <ShieldAlert className="h-5 w-5" />}
                                {n.type === "info" && <Info className="h-5 w-5" />}
                            </div>

                            <div className="space-y-1">
                                <h4 className="font-semibold text-sm leading-tight text-foreground">{n.title}</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed pr-6">{n.desc}</p>
                                <span className="text-[10px] text-muted-foreground/60 block mt-1 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {n.time}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
