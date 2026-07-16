import React, { useState } from "react";
import { CreditCard, Eye, EyeOff, Lock, Unlock, Plus, RefreshCw } from "lucide-react";

export default function RFIDCard() {
    const [isLocked, setIsLocked] = useState(false);
    const [showNumber, setShowNumber] = useState(false);

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const holderName = user?.name || "John Doe";

    const cardData = {
        id: "VOLT-9827-X1",
        rawUid: "04:6A:B2:8E:5C:30:91",
        holder: holderName,
        registeredOn: "Jul 10, 2026",
        walletBalance: "$42.50"
    };

    const logs = [
        { date: "Jul 13, 2026 18:22", station: "Station 4 - Mall of India", action: "Authorized" },
        { date: "Jul 11, 2026 12:45", station: "Station 12 - Airport P3", action: "Authorized" },
        { date: "Jul 08, 2026 09:12", station: "Station 1 - City Center", action: "Authorized" },
    ];

    return (
        <div className="space-y-6 font-sans max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">RFID Cards Management</h1>
                    <p className="text-muted-foreground text-sm">Manage physical RFID tokens used to authorization charging at VoltGrid sockets.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5 self-start">
                    <Plus className="h-4 w-4" /> Link New Card
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Visa-style RFID card graphic */}
                <div className="md:col-span-2 space-y-4">
                    <div className="relative aspect-[1.586/1] w-full rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-border p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
                        {/* Tech styling background grids */}
                        <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none"></div>
                        <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-start z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">VoltGrid Pass</span>
                                <span className="text-xs font-semibold text-primary mt-0.5">RFID NFC Token</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${isLocked
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                }`}>
                                {isLocked ? "Locked" : "Active"}
                            </span>
                        </div>

                        <div className="z-10">
                            <div className="font-mono text-lg tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                {showNumber ? cardData.id : "•••• •••• •••• X1"}
                                <button
                                    onClick={() => setShowNumber(!showNumber)}
                                    className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                                >
                                    {showNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-end z-10 border-t border-border/40 pt-4">
                            <div>
                                <span className="block text-[9px] text-muted-foreground uppercase tracking-wider">Cardholder</span>
                                <span className="text-sm font-semibold">{cardData.holder}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[9px] text-muted-foreground uppercase tracking-wider">Balance</span>
                                <span className="text-sm font-bold text-foreground">{cardData.walletBalance}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Lock controls */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsLocked(!isLocked)}
                            className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${isLocked
                                ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 hover:bg-emerald-500/25"
                                : "bg-red-500/10 text-red-450 border-red-500/20 hover:bg-red-500/25"
                                }`}
                        >
                            {isLocked ? (
                                <>
                                    <Unlock className="h-4 w-4" /> Activate Card
                                </>
                            ) : (
                                <>
                                    <Lock className="h-4 w-4" /> Temporarily Lock
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Scan usage logs */}
                <div className="md:col-span-3 p-6 border border-border bg-card rounded-2xl flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-base">RFID Scan History</h3>
                        <button className="p-1 hover:bg-muted text-muted-foreground rounded-lg transition-colors">
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-3 flex-1">
                        {logs.map((log, index) => (
                            <div key={index} className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">{log.station}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{log.date}</div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-450">
                                    {log.action}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
