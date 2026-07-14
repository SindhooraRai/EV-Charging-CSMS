import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { DollarSign, FileText, CreditCard, ChevronRight } from "lucide-react";

export default function BillSummary() {
    const location = useLocation();
    const navigate = useNavigate();

    // Pick up dynamic state values or default fallback
    const sessionData = location.state || { energy: 32.4, time: "00:46:12", rate: 0.35 };

    const energyCost = +(sessionData.energy * sessionData.rate).toFixed(2);
    const peakFee = 1.50; // Flat peak fee
    const gstTax = +((energyCost + peakFee) * 0.18).toFixed(2); // 18% tax
    const totalCost = +(energyCost + peakFee + gstTax).toFixed(2);

    const handlePayment = () => {
        // Navigate to Success screen passing transaction reference
        navigate("/user/success", { state: { amount: totalCost, energy: sessionData.energy } });
    };

    return (
        <div className="space-y-6 font-sans max-w-md mx-auto py-4">
            <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 grid place-items-center mx-auto">
                    <FileText className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Charging Session Invoice</h1>
                <p className="text-muted-foreground text-sm">Review your session calculations before billing</p>
            </div>

            <div className="border border-border bg-card rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center text-xs text-muted-foreground uppercase tracking-widest pb-3 border-b border-border">
                    <span>Billing Parameter</span>
                    <span>Value</span>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Energy Consumption</span>
                        <span className="font-semibold">{sessionData.energy} kWh</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Charging Duration</span>
                        <span className="font-semibold">{sessionData.time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Rate</span>
                        <span className="font-semibold">${sessionData.rate} / kWh</span>
                    </div>

                    <div className="border-t border-border/60 my-2 pt-2 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Energy Charges</span>
                            <span className="font-semibold">${energyCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Grid Peak Demand Fee</span>
                            <span className="font-semibold">${peakFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Unified Utility Tax (18%)</span>
                            <span className="font-semibold">${gstTax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 flex justify-between items-center text-base font-extrabold text-foreground">
                        <span>Total Payable</span>
                        <span className="text-xl text-primary glow-primary font-black">${totalCost.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-[family-name:var(--font-display)] font-extrabold rounded-xl hover:opacity-90 transition-all glow-primary"
                >
                    <CreditCard className="h-4.5 w-4.5 fill-current" /> Pay Invoice
                </button>
            </div>

            <div className="text-center">
                <Link to="/user/dashboard" className="text-xs text-muted-foreground hover:text-foreground">
                    Cancel and report billing issue
                </Link>
            </div>
        </div>
    );
}
