import React, { useState } from "react";
import { User, Mail, Phone, Car, Check, ShieldCheck } from "lucide-react";

export default function Profile() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    const [name, setName] = useState(user?.name || "John Doe");
    const [email, setEmail] = useState(user?.email || "driver@voltgrid.com");
    const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
    const [vehicle, setVehicle] = useState("Nissan Leaf e+ (62 kWh)");
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const userStrVal = localStorage.getItem("user");
        if (userStrVal) {
            const userObj = JSON.parse(userStrVal);
            localStorage.setItem("user", JSON.stringify({
                ...userObj,
                name,
                phone
            }));
            // Trigger storage event so other components receive the update immediately
            window.dispatchEvent(new Event("storage"));
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="space-y-6 font-sans max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Driver Profile</h1>
                <p className="text-muted-foreground text-sm">Manage your personal information, contact credentials, and vehicle specifications.</p>
            </div>

            <div className="p-6 border border-border bg-card rounded-2xl relative shadow-lg">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-border pb-6">
                        <div className="h-16 w-16 bg-primary/10 border border-primary/25 rounded-full grid place-items-center text-primary text-xl font-bold font-[family-name:var(--font-display)]">
                            {name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "U"}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">{name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">Tier: VoltPremium Operator</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-muted/20 border border-border rounded-xl py-3 pl-4 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full bg-muted/10 border border-border/40 text-muted-foreground rounded-xl py-3 pl-4 pr-4 text-sm cursor-not-allowed font-semibold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mobile Phone</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-muted/20 border border-border rounded-xl py-3 pl-4 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Registered EV Model</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vehicle}
                                    onChange={(e) => setVehicle(e.target.value)}
                                    className="w-full bg-muted/20 border border-border rounded-xl py-3 pl-4 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 flex justify-between items-center gap-4">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4 text-emerald-450" /> Encryption keys locked
                        </span>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5"
                        >
                            {isSaved ? (
                                <>
                                    <Check className="h-4 w-4" /> Profile Updated
                                </>
                            ) : (
                                "Save Profile Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
