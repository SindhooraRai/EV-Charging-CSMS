import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, DollarSign, Navigation, Shield, ShieldCheck } from "lucide-react";

export default function UserSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [autoRefill, setAutoRefill] = useState(true);
    const [refillAmount, setRefillAmount] = useState("$25.00");
    const [mapProvider, setMapProvider] = useState("google");

    return (
        <div className="space-y-6 font-sans max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configuration Settings</h1>
                <p className="text-muted-foreground text-sm">Configure automated charging limits, notifications preferences, and device pairings.</p>
            </div>

            <div className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-lg">
                {/* Alerts Config */}
                <div className="space-y-4">
                    <h3 className="font-bold text-base flex items-center gap-2 pb-2 border-b border-border">
                        <Bell className="h-4.5 w-4.5 text-primary" /> Notifications
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-sm font-semibold">Email Charging Summaries</span>
                                <span className="text-xs text-muted-foreground">Receive PDF tax invoices via email after each socket disconnection.</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={emailAlerts}
                                onChange={(e) => setEmailAlerts(e.target.checked)}
                                className="h-4.5 w-4.5 text-primary focus:ring-primary border-border bg-muted/30 rounded"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-sm font-semibold">Mobile SMS Alerts</span>
                                <span className="text-xs text-muted-foreground">Receive real time text alerts when battery hits limit targets.</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={smsAlerts}
                                onChange={(e) => setSmsAlerts(e.target.checked)}
                                className="h-4.5 w-4.5 text-primary focus:ring-primary border-border bg-muted/30 rounded"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Config */}
                <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-base flex items-center gap-2 pb-2 border-b border-border">
                        <DollarSign className="h-4.5 w-4.5 text-primary" /> Wallet & Billing
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-sm font-semibold">Enable Automated Refills</span>
                                <span className="text-xs text-muted-foreground">Automatically recharge wallet when balance falls below $10.00.</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={autoRefill}
                                onChange={(e) => setAutoRefill(e.target.checked)}
                                className="h-4.5 w-4.5 text-primary focus:ring-primary border-border bg-muted/30 rounded"
                            />
                        </div>
                        {autoRefill && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold">Default Refill Level</span>
                                <select
                                    value={refillAmount}
                                    onChange={(e) => setRefillAmount(e.target.value)}
                                    className="bg-muted border border-border text-sm rounded-lg p-2 focus:ring-1 focus:ring-primary"
                                >
                                    <option value="$10.00">$10.00</option>
                                    <option value="$25.00">$25.00</option>
                                    <option value="$50.00">$50.00</option>
                                    <option value="$100.00">$100.00</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Device Config */}
                <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-base flex items-center gap-2 pb-2 border-b border-border">
                        <Navigation className="h-4.5 w-4.5 text-primary" /> Map defaults
                    </h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="block text-sm font-semibold">Primary Map Provider</span>
                            <span className="text-xs text-muted-foreground">Used for generating routing links.</span>
                        </div>
                        <select
                            value={mapProvider}
                            onChange={(e) => setMapProvider(e.target.value)}
                            className="bg-muted border border-border text-sm rounded-lg p-2 focus:ring-1 focus:ring-primary"
                        >
                            <option value="google">Google Maps</option>
                            <option value="apple">Apple Maps</option>
                            <option value="mapbox">Mapbox Hub</option>
                        </select>
                    </div>
                </div>

                {/* Footer info badge */}
                <div className="border-t border-border pt-4 flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-emerald-450" /> Hardware Security standard TLS 1.3</span>
                    <span className="text-emerald-400 font-semibold">Settings Saved</span>
                </div>
            </div>
        </div>
    );
}
