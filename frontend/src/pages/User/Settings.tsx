import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, IndianRupee, Navigation, Shield, ShieldCheck, Smartphone } from "lucide-react";

export default function UserSettings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [autoRefill, setAutoRefill] = useState(true);
    const [refillAmount, setRefillAmount] = useState("₹2,500.00");
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
                        <IndianRupee className="h-4.5 w-4.5 text-primary" /> Wallet & Billing
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-sm font-semibold">Enable Automated Refills</span>
                                <span className="text-xs text-muted-foreground">Automatically recharge wallet when balance falls below ₹500.00.</span>
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
                                    <option value="₹1,000.00">₹1,000.00</option>
                                    <option value="₹2,500.00">₹2,500.00</option>
                                    <option value="₹5,000.00">₹5,000.00</option>
                                    <option value="₹10,000.00">₹10,000.00</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Config */}
                <div className="space-y-4 pt-2 border-t border-border mt-4">
                    <h3 className="font-bold text-base flex items-center gap-2 pb-2 border-b border-border">
                        <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Security
                    </h3>
                    <div className="space-y-4">
                        {/* Password */}
                        <div className="flex justify-between items-center bg-muted/10 p-3.5 rounded-xl border border-border/40">
                            <div>
                                <span className="block text-sm font-semibold">Password</span>
                                <span className="text-xs text-muted-foreground">••••••••</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => alert("Password change simulated.")}
                                className="px-3.5 py-1.5 bg-muted hover:bg-muted/70 text-xs font-semibold rounded-lg border border-border text-foreground transition-all cursor-pointer select-none"
                            >
                                Change Password
                            </button>
                        </div>

                        {/* 2FA */}
                        <div className="flex justify-between items-center bg-muted/10 p-3.5 rounded-xl border border-border/40">
                            <div>
                                <span className="block text-sm font-semibold">Two-Factor Authentication (2FA)</span>
                                <span className="text-xs text-muted-foreground">Secure your account by sending SMS verification tokens.</span>
                            </div>
                            <input
                                type="checkbox"
                                className="h-4.5 w-4.5 text-primary focus:ring-primary border-border bg-muted/30 rounded cursor-pointer"
                                defaultChecked
                            />
                        </div>

                        {/* Active Devices */}
                        <div className="space-y-2.5">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Active Session Devices</span>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-xl border border-border/30 text-xs">
                                    <Smartphone className="h-4 w-4 text-emerald-400" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-foreground">iPhone 14 Pro Max (Primary)</div>
                                        <div className="text-muted-foreground">Active Now • Bangalore, IN</div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Device Config */}
                <div className="space-y-4 pt-2 border-t border-border mt-4">
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
                <div className="border-t border-border pt-4 flex justify-end items-center text-xs text-muted-foreground">
                    <span className="text-emerald-400 font-semibold">Settings Saved</span>
                </div>
            </div>
        </div>
    );
}
