import React, { useState } from "react";
import { Settings, Shield, Server, Database, Save, Check } from "lucide-react";

export default function AdminSettings() {
    const [ocppUrl, setOcppUrl] = useState("ws://central-system.voltgrid-infra.com:9000/ocpp");
    const [heartbeat, setHeartbeat] = useState(60);
    const [allowPublicReg, setAllowPublicReg] = useState(true);
    const [loadShedding, setLoadShedding] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="space-y-6 font-sans max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground text-sm">Configure global parameter options for OCPP sockets, billing thresholds, and database synchronizers.</p>
            </div>

            <form onSubmit={handleSave} className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-lg">
                {/* Server Configurations */}
                <div className="space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2 pb-2 border-b border-border">
                        <Server className="h-4 w-4 text-primary" /> OCPP Network parameters
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block font-semibold text-muted-foreground uppercase tracking-wider mb-2">Central System WebSocket URI</label>
                            <input
                                type="text"
                                value={ocppUrl}
                                onChange={(e) => setOcppUrl(e.target.value)}
                                className="w-full bg-muted/20 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-muted-foreground uppercase tracking-wider mb-2">Heartbeat Interval (Seconds)</label>
                            <input
                                type="number"
                                value={heartbeat}
                                onChange={(e) => setHeartbeat(parseInt(e.target.value))}
                                className="w-full bg-muted/20 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                            />
                        </div>
                    </div>
                </div>

                {/* Global Security parameters */}
                <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-sm flex items-center gap-2 pb-2 border-b border-border">
                        <Shield className="h-4 w-4 text-primary" /> System Protections
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-sm font-semibold">Enable Safe Guest Registration</span>
                                <span className="text-xs text-muted-foreground">Allows drivers to self register and check nearby status without administrative pre-approval.</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={allowPublicReg}
                                onChange={(e) => setAllowPublicReg(e.target.checked)}
                                className="h-4.5 w-4.5 text-primary border-border bg-muted/30 rounded focus:ring-primary"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-sm font-semibold">Dynamic Smart Load Balancing</span>
                                <span className="text-xs text-muted-foreground">Reduces connector power output incrementally if grid peak reaches critical values.</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={loadShedding}
                                onChange={(e) => setLoadShedding(e.target.checked)}
                                className="h-4.5 w-4.5 text-primary border-border bg-muted/30 rounded focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Database parameters */}
                <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-sm flex items-center gap-2 pb-2 border-b border-border">
                        <Database className="h-4 w-4 text-primary" /> Audit & Backups
                    </h3>
                    <div className="flex items-center justify-between text-xs">
                        <div>
                            <span className="block font-semibold">Automated Backup Interval</span>
                            <span className="text-muted-foreground mt-0.5 block">Stored securely to GCP Cloud Storage bucket.</span>
                        </div>
                        <button type="button" className="px-4 py-2 border border-border bg-card hover:bg-muted font-bold rounded-xl transition-colors">
                            Run Manual Backup Now
                        </button>
                    </div>
                </div>

                <div className="border-t border-border pt-6 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Admin keys level zero authorization required</span>
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5"
                    >
                        {isSaved ? <><Check className="h-4 w-4" /> Changes Applied</> : <><Save className="h-4.5 w-4.5 fill-current" /> Save Config</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
