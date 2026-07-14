import React from "react";
import {
    TrendingUp,
    Battery,
    Activity,
    MapPin,
    Calendar,
    Zap,
    Clock,
    Compass
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
    Legend,
    ResponsiveContainer
} from "recharts";

export default function AdminAnalytics() {
    const chartData = [
        { label: "Jun 2026", energy: 120, revenue: 3800 },
        { label: "Jul 2026", energy: 180, revenue: 5400 },
        { label: "Aug 2026", energy: 240, revenue: 7600 },
        { label: "Sep 2026", energy: 310, revenue: 9800 },
        { label: "Oct 2026", energy: 450, revenue: 14000 },
    ];

    const distributionData = [
        { name: "CP Hub", DC: 65, AC: 20 },
        { name: "Airport T3", DC: 90, AC: 10 },
        { name: "Sector 18", DC: 25, AC: 80 },
        { name: "Vasant Kunj", DC: 0, AC: 45 },
    ];

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics & Load Profiler</h1>
                    <p className="text-muted-foreground text-sm">Long term forecasting of grid utilization, driver demand peaks, and utility offsets.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Select Epoch (2026)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 border border-border bg-card rounded-2xl">
                    <span className="block text-xs uppercase font-bold text-muted-foreground tracking-wider">Average Session Duration</span>
                    <span className="text-2xl font-black block mt-2 text-foreground">42.8 minutes</span>
                    <span className="text-xs text-muted-foreground mt-1 block">Peak duration: 1-2 Hours (AC connectors)</span>
                </div>
                <div className="p-5 border border-border bg-card rounded-2xl">
                    <span className="block text-xs uppercase font-bold text-muted-foreground tracking-wider">Primary Driver Base</span>
                    <span className="text-2xl font-black block mt-2 text-primary">1,402 Active</span>
                    <span className="text-xs text-emerald-450 mt-1 block">+18% growth this month</span>
                </div>
                <div className="p-5 border border-border bg-card rounded-2xl">
                    <span className="block text-xs uppercase font-bold text-muted-foreground tracking-wider">Total CO2 Displaced</span>
                    <span className="text-2xl font-black block mt-2 text-emerald-450">4.2 Metric Tons</span>
                    <span className="text-xs text-muted-foreground mt-1 block">Calculated at 0.5 kg offset per kWh</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total energy chart */}
                <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
                    <h3 className="font-semibold text-base">Long-term Energy Load Profile (MWh)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="label" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px" }} />
                                <Area type="monotone" dataKey="energy" name="Energy (MWh)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEn)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distributed Load Type by Station */}
                <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
                    <h3 className="font-semibold text-base">Socket Split utilization (DC peak vs AC offset)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px" }} />
                                <Legend iconType="circle" />
                                <Bar dataKey="DC" name="DC Fast Chargers (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="AC" name="AC Standard (%)" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
