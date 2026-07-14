import React from "react";
import { useParams, Link } from "react-router-dom";
import {
    Zap,
    MapPin,
    Clock,
    DollarSign,
    BatteryCharging,
    ArrowLeft,
    CheckCircle,
    AlertTriangle
} from "lucide-react";

export default function UserStationDetails() {
    const { id } = useParams();

    // Mock station data lookup
    const station = {
        id: id || "1",
        name: "Connaught Place Supercharger Hub",
        address: "Outer Circle, Block E, Connaught Place, New Delhi",
        pricing: "$0.35 per kWh (Peak), $0.25 per kWh (Off-Peak)",
        uptime: "99.8%",
        provider: "VoltGrid Infra",
        connectors: [
            { id: "C1", type: "CCS Type 2", speed: "150 kW DC Fast", status: "Available", color: "text-emerald-450 bg-emerald-500/10 border-emerald-500/20" },
            { id: "C2", type: "CCS Type 2", speed: "150 kW DC Fast", status: "Occupied (Leaf - 88%)", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            { id: "C3", type: "Type 2 AC", speed: "22 kW AC Charger", status: "Available", color: "text-emerald-450 bg-emerald-500/10 border-emerald-500/20" },
            { id: "C4", type: "Type 2 AC", speed: "22 kW AC Charger", status: "Offline (Maintenance)", color: "text-red-400 bg-red-500/10 border-red-500/20" }
        ]
    };

    return (
        <div className="space-y-6 font-sans max-w-4xl mx-auto">
            <div>
                <Link to="/user/nearby" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Nearby Chargers List
                </Link>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{station.name}</h1>
                        <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> {station.address}
                        </p>
                    </div>
                    <Link
                        to="/user/live"
                        className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all glow-primary flex items-center gap-2 max-sm:w-full justify-center"
                    >
                        <BatteryCharging className="h-4 w-4" /> Start Charging Session
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info panel */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 border border-border bg-card rounded-2xl space-y-4">
                        <h3 className="font-bold text-base border-b border-border pb-3">Station Parameters</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs text-muted-foreground">Tariff Rate</span>
                                <span className="text-sm font-semibold flex items-center gap-1 mt-1 text-emerald-450">
                                    <DollarSign className="h-3.5 w-3.5" /> {station.pricing}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground">Historical Uptime</span>
                                <span className="text-sm font-semibold flex items-center gap-1 mt-1">
                                    <Clock className="h-3.5 w-3.5 text-primary" /> {station.uptime}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground">Network Provider</span>
                                <span className="text-sm font-semibold block mt-1">{station.provider}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-muted-foreground">Active Load Balance</span>
                                <span className="text-xs text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1 inline-block font-semibold">
                                    Stable - 300kW Max
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Connected hardware sockets */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-base">Connectors at this Location</h3>
                        <div className="space-y-3">
                            {station.connectors.map((c) => (
                                <div key={c.id} className="p-4 bg-muted/20 border border-border rounded-xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg grid place-items-center">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{c.type}</div>
                                            <div className="text-xs text-muted-foreground">{c.speed} • ID: {c.id}</div>
                                        </div>
                                    </div>

                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${c.color}`}>
                                        {c.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Operational Updates / Amenities */}
                <div className="space-y-6">
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-4">
                        <h4 className="font-semibold text-sm">Station Amenities</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> Restrooms on premises</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> Cafe & Shopping (2 min walk)</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> 24/7 Security CCTV coverage</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> Illuminated parking bays</li>
                        </ul>
                    </div>

                    <div className="p-5 border border-amber-500/20 bg-amber-500/5 rounded-2xl flex gap-3 text-amber-400">
                        <AlertTriangle className="h-5 w-5 shrink-0" />
                        <div>
                            <h5 className="font-semibold text-xs leading-none">Connector 4 Offline</h5>
                            <p className="text-[10px] text-amber-500/80 mt-1 lines-2">
                                Under maintenance for cable replacement. Expected online in 6 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
