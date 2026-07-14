import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { stations } from "@/lib/mock";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw, Unlock, ShieldAlert, Cpu, Settings, Play, Square, BatteryCharging, Zap } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/stations/$id")({
    head: ({ params }) => ({ meta: [{ title: `Station Details: ${params.id} · VoltGrid Admin` }] }),
    component: StationDetail,
});

function StationDetail() {
    const { id } = Route.useParams();

    // Find station by ID or fallback
    const stationItem = stations.find((s) => s.id === id) || stations[0];
    const [station, setStation] = useState(stationItem);
    const [isRebooting, setIsRebooting] = useState(false);
    const [powerLimit, setPowerLimit] = useState(station.power);
    const [tariff, setTariff] = useState(station.price === 22 || station.price === 26 ? "TRF-002" : station.price === 28 ? "TRF-003" : "TRF-001");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleReboot = () => {
        setIsRebooting(true);
        const prevStatus = station.status;
        setStation(prev => ({ ...prev, status: "offline" }));
        toast.loading("Sending Remote Reboot Command (OCPP: Reboot)...", { id: "reboot-toast" });

        setTimeout(() => {
            setStation(prev => ({ ...prev, status: "online" }));
            setIsRebooting(false);
            toast.success("Station Reboot Complete", {
                id: "reboot-toast",
                description: "OCPP Heartbeat registered. Connection stable."
            });
        }, 3000);
    };

    const handleUnlockConnector = (connectorId: number) => {
        toast.loading(`Sending Unlock Connector Command (Connector ${connectorId})...`, { id: "connector-toast" });
        setTimeout(() => {
            toast.success("Connector Unlocked Successfully", {
                id: "connector-toast",
                description: `Connector ${connectorId} on ${station.name} is now free.`
            });
        }, 1500);
    };

    const toggleCharging = () => {
        if (station.status === "charging") {
            setStation(prev => ({ ...prev, status: "online" }));
            toast.success("Charging session stopped remotely.");
        } else {
            setStation(prev => ({ ...prev, status: "charging" }));
            toast.success("Charging session started remotely.");
        }
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
            const chosenPrice = tariff === "TRF-002" ? 22 : tariff === "TRF-003" ? 28 : 15;
            setStation(prev => ({ ...prev, power: powerLimit, price: chosenPrice }));
            toast.success("Station Parameters Updated", {
                description: `Max Load: ${powerLimit} kW, Tariff Price: ₹${chosenPrice}/kWh`
            });
        }, 800);
    };

    return (
        <div>
            <div className="mb-4">
                <Link to="/admin/stations" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Stations
                </Link>
            </div>

            <PageHeader
                title={station.name}
                subtitle={`${station.address}, ${station.city}`}
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={handleReboot}
                            disabled={isRebooting}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold hover:bg-card/50 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${isRebooting ? "animate-spin" : ""}`} /> Reboot
                        </button>
                        <button
                            onClick={toggleCharging}
                            disabled={station.status === "offline" || isRebooting}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all disabled:opacity-40 ${station.status === "charging" ? "bg-amber-500 hover:opacity-90" : "bg-teal-600 hover:bg-teal-700"}`}
                        >
                            {station.status === "charging" ? (
                                <>
                                    <Square className="h-3.5 w-3.5 fill-current" /> Stop Charge
                                </>
                            ) : (
                                <>
                                    <Play className="h-3.5 w-3.5 fill-current" /> Start Charge
                                </>
                            )}
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left/Middle Column: Diagnostics and Connector Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-sm font-semibold mb-4">Live State Panel</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-muted/20 rounded-xl">
                                <div className="text-xs text-muted-foreground">Status</div>
                                <div className="mt-1 flex items-center gap-1">
                                    <StatusBadge status={station.status} />
                                </div>
                            </div>
                            <div className="p-4 bg-muted/20 rounded-xl">
                                <div className="text-xs text-muted-foreground">Power Capacity</div>
                                <div className="text-lg stat font-bold text-foreground mt-1">{station.power} kW</div>
                            </div>
                            <div className="p-4 bg-muted/20 rounded-xl">
                                <div className="text-xs text-muted-foreground">Current Tariff</div>
                                <div className="text-lg stat font-bold mt-1 text-foreground">₹{station.price}/kWh</div>
                            </div>
                            <div className="p-4 bg-muted/20 rounded-xl">
                                <div className="text-xs text-muted-foreground">Total Revenue</div>
                                <div className="text-lg stat font-bold text-foreground mt-1">₹{station.revenue.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-sm font-semibold mb-4">Connector Status & Actions</h3>
                        <div className="space-y-3">
                            {Array.from({ length: station.connectors }, (_, i) => i + 1).map((num) => {
                                const isConnCharging = station.status === "charging" && num === 1;
                                const isConnFault = station.status === "fault" && num === 3;
                                const isConnOffline = station.status === "offline";
                                let statusStr = "Available";
                                if (isConnCharging) statusStr = "Charging";
                                else if (isConnFault) statusStr = "Faulted";
                                else if (isConnOffline) statusStr = "Offline";

                                return (
                                    <div key={num} className="flex items-center justify-between border border-border/40 p-4 rounded-xl hover:bg-card/20 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-surface border border-border">
                                                <BatteryCharging className={`h-4 w-4 ${isConnCharging ? "text-amber-500" : isConnFault ? "text-danger" : "text-teal-500"}`} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold">Connector #{num}</div>
                                                <div className="text-xs text-muted-foreground">CCS2 Type · {statusStr}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUnlockConnector(num)}
                                                disabled={isConnOffline}
                                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs hover:bg-card transition-all disabled:opacity-50"
                                            >
                                                <Unlock className="h-3 w-3" /> Unlock
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Configurations */}
                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6">
                        <h3 className="text-sm font-semibold mb-4">Configuration Settings</h3>
                        <form onSubmit={handleSaveChanges} className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-xs text-muted-foreground">Max Power Load Limit</label>
                                    <span className="text-xs stat font-bold">{powerLimit} kW</span>
                                </div>
                                <input
                                    type="range"
                                    min="22"
                                    max="350"
                                    step="5"
                                    value={powerLimit}
                                    onChange={(e) => setPowerLimit(Number(e.target.value))}
                                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">Adjust station charging rate capability to match local grid load constraints.</p>
                            </div>

                            <div>
                                <label className="block text-xs text-muted-foreground mb-1">Assign Tariff Rate</label>
                                <select
                                    value={tariff}
                                    onChange={(e) => setTariff(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="TRF-001">Standard AC (₹15/kWh)</option>
                                    <option value="TRF-002">Fast DC Rate (₹22/kWh)</option>
                                    <option value="TRF-003">Ultra Fast Charging (₹28/kWh)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95 transition-opacity disabled:opacity-70 mt-2"
                            >
                                {isUpdating ? "Saving..." : "Save Configuration"}
                            </button>
                        </form>
                    </div>

                    <div className="glass rounded-2xl p-5 flex gap-3.5 items-start">
                        <div className="h-9 w-9 min-w-9 rounded-lg bg-surface border border-border grid place-items-center text-primary">
                            <Cpu className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold">OCPP Metadata Info</div>
                            <div className="text-[10px] text-muted-foreground space-y-0.5 mt-1">
                                <div>Model: Alfen Twin 4WG</div>
                                <div>Firmware: v4.11.2-4112</div>
                                <div>Protocol Version: OCPP 1.6-J</div>
                                <div>Serial: ALN-2024-8199201</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
