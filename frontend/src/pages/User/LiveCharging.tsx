import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Play, Square, AlertTriangle, ShieldCheck, BatteryCharging } from "lucide-react";

export default function LiveCharging() {
    const [soc, setSoc] = useState(42);
    const [power, setPower] = useState(115.4);
    const [energyDelivered, setEnergyDelivered] = useState(12.45);
    const [seconds, setSeconds] = useState(380);
    const [isCharging, setIsCharging] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let interval: any;
        if (isCharging) {
            interval = setInterval(() => {
                setSoc((prev) => {
                    if (prev >= 100) {
                        setIsCharging(false);
                        return 100;
                    }
                    return prev + 1;
                });
                setEnergyDelivered((prev) => +(prev + 0.12).toFixed(2));
                setSeconds((prev) => prev + 1);
                // Slightly randomizing charging power to look extremely dynamic and real!
                setPower((prev) => +(prev + (Math.random() - 0.5) * 2).toFixed(1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCharging]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStopSession = () => {
        setIsCharging(false);
        // Push the state values to the BillSummary page so it is fully dynamic!
        navigate("/user/bill", { state: { energy: energyDelivered, time: formatTime(seconds), rate: 0.35 } });
    };

    return (
        <div className="space-y-6 font-sans max-w-2xl mx-auto text-center py-6">
            <div className="space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 text-primary grid place-items-center mx-auto glow-primary animate-pulse">
                    <Zap className="h-5 w-5 fill-current" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Active Charging Session</h1>
                <p className="text-muted-foreground text-sm">Station 1 • Connector C1 (CCS Type 2)</p>
            </div>

            {/* Charging percentage graphic */}
            <div className="p-8 border border-border bg-card rounded-3xl relative overflow-hidden flex flex-col items-center">
                {/* Radial style progress circle background */}
                <div className="relative h-44 w-44 rounded-full border-4 border-muted flex items-center justify-center glow-accent">
                    {/* Neon charging visual styling */}
                    <div className="text-center">
                        <span className="text-4xl font-extrabold block text-foreground animate-pulse">{soc}%</span>
                        <span className="text-xxs text-primary uppercase font-bold tracking-wider flex items-center gap-0.5 justify-center mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-450 animate-ping"></span> Charging
                        </span>
                    </div>
                </div>

                {/* Telemetry fields */}
                <div className="grid grid-cols-3 gap-6 w-full mt-8 border-t border-border pt-6">
                    <div>
                        <span className="block text-xs text-muted-foreground uppercase">Power Rate</span>
                        <span className="text-base font-bold mt-1 text-foreground block">{isCharging ? `${power} kW` : "0.0 kW"}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-muted-foreground uppercase">Delivered</span>
                        <span className="text-base font-bold mt-1 text-primary block">{energyDelivered} kWh</span>
                    </div>
                    <div>
                        <span className="block text-xs text-muted-foreground uppercase">Duration</span>
                        <span className="text-base font-bold mt-1 text-foreground block">{formatTime(seconds)}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={handleStopSession}
                    className="px-6 py-3 border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                    <Square className="h-4 w-4 fill-current" /> Stop Session
                </button>
            </div>

            {/* Security alert indicator */}
            <div className="p-4 border border-border bg-muted/20 rounded-xl flex items-center gap-3 text-left">
                <ShieldCheck className="h-5 w-5 text-emerald-450 shrink-0" />
                <p className="text-xs text-muted-foreground">
                    VoltShield hardware check active. Temperature & voltage metrics are within safe limits.
                </p>
            </div>
        </div>
    );
}
