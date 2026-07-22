import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Zap,
    MapPin,
    Clock,
    IndianRupee,
    BatteryCharging,
    ArrowLeft,
    CheckCircle,
    AlertTriangle
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function UserStationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [station, setStation] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [starting, setStarting] = useState<boolean>(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const headers: Record<string, string> = {};
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
                const response = await fetch(`${API_URL}/stations/${id}`, { headers });
                if (response.ok) {
                    const data = await response.json();
                    setStation(data);
                } else {
                    console.error("Failed to load station details:", response.statusText);
                }
            } catch (error) {
                console.error("Failed to fetch station details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleStartSession = async () => {
        if (!station || starting) return;
        setStarting(true);
        try {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            const response = await fetch(`${API_URL}/transactions/start`, {
                method: "POST",
                headers,
                body: JSON.stringify({ station_id: station.id })
            });

            if (response.ok) {
                const txData = await response.json();
                navigate("/user/live", {
                    state: {
                        transactionId: txData.id,
                        stationName: station.station_name,
                        pricePerKwh: station.price_per_kwh
                    }
                });
            } else {
                const errData = await response.json();
                alert(`Failed to start charging session: ${errData.detail || response.statusText}`);
            }
        } catch (error) {
            console.error("Error starting charging session:", error);
            alert("Network connection error. Failed to dispatch start command.");
        } finally {
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 animate-pulse font-sans">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-semibold">Loading grid station specifications...</p>
            </div>
        );
    }

    if (!station) {
        return (
            <div className="text-center py-12 max-w-md mx-auto font-sans">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                <h3 className="text-lg font-bold text-white mt-4">Station Not Found</h3>
                <p className="text-slate-400 text-xs mt-2">The requested charger node could not be retrieved from the active power grid.</p>
                <Link to="/user/nearby" className="mt-6 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90">
                    Back to Grid Map
                </Link>
            </div>
        );
    }

    // Expand connectors count to individual sockets representation
    const getExpandedConnectors = () => {
        if (!station.connectors) return [];
        const list: any[] = [];
        let socketIndex = 1;
        station.connectors.forEach((conn: any) => {
            const count = conn.count || 1;
            for (let i = 0; i < count; i++) {
                const socketId = `C${socketIndex++}`;
                let socketStatus = "Available";
                let color = "text-emerald-450 bg-emerald-500/10 border-emerald-500/20";

                if (station.status.toLowerCase() === "offline") {
                    socketStatus = "Offline (Maintenance)";
                    color = "text-red-400 bg-red-500/10 border-red-500/20";
                } else if (station.status.toLowerCase() === "charging" && socketIndex === 2) {
                    socketStatus = "Occupied (In Use)";
                    color = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                }

                list.push({
                    id: socketId,
                    type: conn.type,
                    speed: conn.power,
                    status: socketStatus,
                    color
                });
            }
        });
        return list;
    };

    const connectorsToRender = getExpandedConnectors();
    const hasOfflineSockets = connectorsToRender.some(c => c.status.includes("Offline"));

    return (
        <div className="space-y-6 font-sans max-w-4xl mx-auto">
            <div>
                <Link to="/user/nearby" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Nearby Chargers List
                </Link>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">{station.station_name}</h1>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> {station.address || `${station.city}, Karnataka`}
                        </p>
                    </div>
                    {station.status.toLowerCase() !== "offline" && (
                        <button
                            onClick={handleStartSession}
                            disabled={starting || station.available_chargers <= 0}
                            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all glow-primary flex items-center gap-2 max-sm:w-full justify-center cursor-pointer select-none"
                        >
                            <BatteryCharging className="h-4 w-4" />
                            <span>{starting ? "Connecting Node..." : station.available_chargers <= 0 ? "No Slots Free" : "Start Charging Session"}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info panel */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 border border-card-border bg-card rounded-2xl space-y-4">
                        <h3 className="font-bold text-base border-b border-card-border pb-3 text-white">Station Parameters</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs text-slate-400">Tariff Rate</span>
                                <span className="text-sm font-semibold flex items-center gap-1 mt-1 text-emerald-450">
                                    <IndianRupee className="h-3.5 w-3.5" /> ₹{station.price_per_kwh} per kWh
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">Historical Uptime</span>
                                <span className="text-sm font-semibold flex items-center gap-1 mt-1 text-white">
                                    <Clock className="h-3.5 w-3.5 text-primary" /> {station.status.toLowerCase() === "offline" ? "92.4%" : "99.8%"}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">Network Provider</span>
                                <span className="text-sm font-semibold block mt-1 text-white">VoltGrid Infra</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">Active Load Balance</span>
                                <span className="text-xs text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1 inline-block font-semibold">
                                    Stable - 240kW Max
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Connected hardware sockets */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-base text-white">Connectors at this Location</h3>
                        <div className="space-y-3">
                            {connectorsToRender.map((c) => (
                                <div key={c.id} className="p-4 bg-slate-900/30 border border-card-border rounded-xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg grid place-items-center">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{c.type}</div>
                                            <div className="text-xs text-slate-400">{c.speed} • ID: {c.id}</div>
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
                    <div className="p-5 border border-card-border bg-card rounded-2xl space-y-4">
                        <h4 className="font-semibold text-sm text-white">Station Amenities</h4>
                        <ul className="space-y-2 text-xs text-slate-450">
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> Restrooms on premises</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> Cafe & Shopping (2 min walk)</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> 24/7 Security CCTV coverage</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-450" /> Illuminated parking bays</li>
                        </ul>
                    </div>

                    {station.status.toLowerCase() === "offline" ? (
                        <div className="p-5 border border-red-500/25 bg-red-500/5 rounded-2xl flex gap-3 text-red-400">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <div>
                                <h5 className="font-semibold text-xs leading-none">Station Offline</h5>
                                <p className="text-[10px] text-red-500/80 mt-1">
                                    Currently undergoing grid-level maintenance. Remote diagnostic commands are currently restricted.
                                </p>
                            </div>
                        </div>
                    ) : hasOfflineSockets ? (
                        <div className="p-5 border border-amber-500/20 bg-amber-500/5 rounded-2xl flex gap-3 text-amber-400">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <div>
                                <h5 className="font-semibold text-xs leading-none">Connectors Alert</h5>
                                <p className="text-[10px] text-amber-500/80 mt-1">
                                    One or more sockets are experiencing high demand or scheduling delays.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl flex gap-3 text-emerald-400">
                            <CheckCircle className="h-5 w-5 shrink-0" />
                            <div>
                                <h5 className="font-semibold text-xs leading-none">Grid Status: Active</h5>
                                <p className="text-[10px] text-emerald-500/80 mt-1">
                                    All connectors reporting normal load metrics. Seamless billing verification active.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

