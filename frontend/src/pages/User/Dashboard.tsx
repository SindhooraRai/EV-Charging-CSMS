import React from "react";
import { Link } from "react-router-dom";
import {
    BatteryCharging,
    MapPin,
    History,
    DollarSign,
    ArrowUpRight,
    Zap,
    Compass
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function UserDashboard() {
    // Mock Data for session history chart
    const data = [
        { date: "Jul 08", energy: 12 },
        { date: "Jul 09", energy: 24 },
        { date: "Jul 10", energy: 18 },
        { date: "Jul 11", energy: 35 },
        { date: "Jul 12", energy: 22 },
        { date: "Jul 13", energy: 40 },
        { date: "Jul 14", energy: 28 },
    ];

    const recentSessions = [
        { id: 1, loc: "Station 4 - Mall of India", date: "Jul 13, 2026", cost: "$14.20", kwh: "32 kWh" },
        { id: 2, loc: "Station 12 - Airport P3", date: "Jul 11, 2026", cost: "$18.50", kwh: "44 kWh" },
        { id: 3, loc: "Station 1 - City Center", date: "Jul 08, 2026", cost: "$9.80", kwh: "20 kWh" },
    ];

    return (
        <div className="space-y-6 font-sans">
            {/* Welcome header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, John!</h1>
                    <p className="text-muted-foreground text-sm">Your Nissan Leaf is configured and healthy.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/user/nearby" className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:bg-muted rounded-xl text-sm font-semibold transition-all">
                        <MapPin className="h-4 w-4" />
                        Find Chargers
                    </Link>
                    <Link to="/user/live" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all glow-primary">
                        <BatteryCharging className="h-4 w-4" />
                        Charge Now
                    </Link>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 border border-border bg-card rounded-2xl relative overflow-hidden">
                    <div className="text-sm font-medium text-muted-foreground">Wallet Balance</div>
                    <div className="text-2xl font-extrabold mt-1">$42.50</div>
                    <div className="text-xs text-emerald-450 mt-1 flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" /> Auto-refill active
                    </div>
                    <DollarSign className="absolute right-4 top-4 h-8 w-8 text-muted-foreground/10" />
                </div>

                <div className="p-5 border border-border bg-card rounded-2xl relative overflow-hidden">
                    <div className="text-sm font-medium text-muted-foreground">Last Session Energy</div>
                    <div className="text-2xl font-extrabold mt-1">32.4 kWh</div>
                    <div className="text-xs text-muted-foreground mt-1">Charged on Jul 13</div>
                    <Zap className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
                </div>

                <div className="p-5 border border-border bg-card rounded-2xl relative overflow-hidden">
                    <div className="text-sm font-medium text-muted-foreground">Active Charge Rate</div>
                    <div className="text-2xl font-extrabold mt-1 text-emerald-450 glow-primary select-none">0.0 kW</div>
                    <div className="text-xs text-muted-foreground mt-1">Plugged Out - Standby</div>
                    <BatteryCharging className="absolute right-4 top-4 h-8 w-8 text-emerald-500/10" />
                </div>

                <div className="p-5 border border-border bg-card rounded-2xl relative overflow-hidden">
                    <div className="text-sm font-medium text-muted-foreground">Total CO2 Savings</div>
                    <div className="text-2xl font-extrabold mt-1">420 kg</div>
                    <div className="text-xs text-emerald-450 mt-1">Equivalent to 12 trees</div>
                    <Compass className="absolute right-4 top-4 h-8 w-8 text-cyan-500/10" />
                </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 border border-border bg-card rounded-2xl lg:col-span-2">
                    <h3 className="font-semibold text-base mb-4">Energy Consumed (Last 7 Days)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px" }}
                                    labelStyle={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "bold" }}
                                    itemStyle={{ color: "#10b981", fontSize: "14px" }}
                                />
                                <Area type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Session logs */}
                <div className="p-6 border border-border bg-card rounded-2xl flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-base">Recent Sessions</h3>
                        <Link to="/user/history" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                            View All <History className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {recentSessions.map((session) => (
                            <div key={session.id} className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-center justify-between">
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold truncate">{session.loc}</div>
                                    <div className="text-xs text-muted-foreground">{session.date}</div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-sm font-bold text-foreground">{session.cost}</div>
                                    <div className="text-xs text-muted-foreground">{session.kwh}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
