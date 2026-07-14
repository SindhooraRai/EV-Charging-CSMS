import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Printer, RefreshCw } from "lucide-react";

export default function PaymentSuccess() {
    const location = useLocation();

    // Pick up state values or fallback to defaults
    const txnData = location.state || { amount: 14.59, energy: 32.4 };

    // Random receipt references
    const receiptNum = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    return (
        <div className="space-y-6 font-sans max-w-md mx-auto py-10 text-center">
            <div className="space-y-3">
                {/* Animated Green Badge */}
                <div className="h-16 w-16 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto glow-primary">
                    <CheckCircle className="h-9 w-9 fill-emerald-500/10" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Payment Complete</h1>
                <p className="text-muted-foreground text-sm">Thank you! Your transaction was approved immediately.</p>
            </div>

            <div className="border border-border bg-card rounded-2xl p-6 space-y-4 text-left shadow-lg">
                <div className="flex justify-between border-b border-border pb-3 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                    <span>Receipt Info</span>
                    <span>Details</span>
                </div>

                <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Receipt Number</span>
                        <span className="font-mono font-semibold">{receiptNum}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-bold text-emerald-450">${txnData.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Energy Transferred</span>
                        <span className="font-semibold">{txnData.energy} kWh</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                            Settled
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 justify-center">
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 border border-border bg-card hover:bg-muted text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5"
                >
                    <Printer className="h-4 w-4" /> Print Receipt
                </button>

                <Link
                    to="/user/dashboard"
                    className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5"
                >
                    Portal Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
