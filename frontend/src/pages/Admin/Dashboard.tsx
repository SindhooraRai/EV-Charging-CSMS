import React from "react";
import { Link } from "react-router-dom";
import {
    Zap,
    Activity,
    DollarSign,
    ShieldAlert,
    TrendingUp,
    Compass,
    MessageSquare,
    ArrowRight
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
    const stats = [
        { label: "Active Charger Sessions", value: "84 / 150", sub: "56% Grid capacity", color: "text-primary" },
        { label: "Total Revenue (Today)", value: "$2,840.50", sub: "+12.4% vs yesterday", color: "text-emerald-450" },
        { label: "Total Energy (Today)", value: "8.1 MWh", sub: "Peak demand at 6 PM", color: "text-foreground" },
        { label: "Pending System Alerts", value: "3 Critical", sub: "Needs engineer dispatch", color: "text-destructive" }
    ];

    const chartData = [
        { hour: "08:00", active: 20, revenue: 400 },
        { hour: "10:00", active: 45, revenue: 900 },
        { hour: "12:00", active: 62, revenue: 1240 },
        { hour: "14:00", active: 55, revenue: 1100 },
        { hour: "16:00", active: 75, revenue: 1600 },
        { hour: "18:00", active: 84, revenue: 1900 },
        { hour: "20:00", active: 60, revenue: 1300 },
    ];

    const recentAlerts = [
        { id: 1, loc: "Station 4 - Mall of India", msg: "Connector C4 Thermal Overload (>85°C)", severity: "critical", time: "10m ago" },
        { id: 2, loc: "Station 1 - Connaught Place", msg: "Meter value signature mismatch suspect", severity: "warning", time: "32m ago" },
        { id: 3, loc: "Station 8 - Dwarka Sec 10", msg: "Unit ping packet latency > 1500ms", severity: "info", time: "1h ago" }
    ];

    return (
        <div className="space-y-6 font-sans">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">CSMS Command Center</h1>
                    <p className="text-muted-foreground text-sm">Real-time OCPP 1.6/2.0.1 Central System metrics & diagnostic controls.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/admin/alerts" className="px-4 py-2 border border-border bg-card hover:bg-muted text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4 text-destructive" /> View Alerts
                    </Link>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-5 border border-border bg-card rounded-2xl relative overflow-hidden">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                        <div className={`text-2xl font-black mt-2 ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 border border-border bg-card rounded-2xl lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-base">Grid Utilization & Revenue Trend</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-450" /> Live updates every 5s
                        </span>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="hour" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px" }}
                                    labelStyle={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "bold" }}
                                />
                                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Alerts Stream */}
                <div className="p-6 border border-border bg-card rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-base">Grid Safety Feed</h3>
                            <span className="h-2 w-2 rounded-full bg-destructive animate-ping"></span>
                        </div>
                        <div className="space-y-4">
                            {recentAlerts.map((n) => (
                                <div key={n.id} className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-1 relative">
                                    <div className="flex justify-between items-start gap-2">
                                        <h5 className="font-bold text-xs truncate max-w-[80%]">{n.loc}</h5>
                                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{n.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link to="/admin/alerts" className="mt-4 flex justify-between items-center text-xs font-semibold text-primary hover:underline pt-4 border-t border-border">
                        Open Alerts Hub <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
