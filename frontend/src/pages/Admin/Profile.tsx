import React, { useState } from "react";
import { User, Mail, Shield, Check } from "lucide-react";

export default function AdminProfile() {
    const [name, setName] = useState("Root Administrator");
    const [email, setEmail] = useState("support@voltgrid.com");
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="space-y-6 font-sans max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Operator Profile</h1>
                <p className="text-muted-foreground text-sm font-normal">Manage database admin credentials and notifications alerts levels.</p>
            </div>

            <div className="p-6 border border-border bg-card rounded-2xl relative shadow-lg">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-border pb-6">
                        <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full grid place-items-center text-primary text-xl font-bold font-[family-name:var(--font-display)]">
                            RA
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">{name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">Superuser Security Level: 0</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Operator Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-muted/20 border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Registered Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full bg-muted/10 border border-border/40 text-muted-foreground rounded-xl py-3 px-4 text-sm cursor-not-allowed font-semibold"
                            />
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 flex justify-between items-center gap-4">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Shield className="h-4 w-4 text-emerald-450" /> Secure Admin Access Approved
                        </span>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5"
                        >
                            {isSaved ? <><Check className="h-4 w-4" /> Updated</> : "Save Preferences"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
