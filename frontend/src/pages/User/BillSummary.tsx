import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { IndianRupee, FileText, CreditCard, AlertTriangle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function BillSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const [paying, setPaying] = useState(false);

    // Pick up dynamic state values or default fallback
    const sessionData = location.state || {
        transactionId: null,
        stationName: "Mangaluru Port Ultra-Fast Hub",
        energy: 32.4,
        time: "00:46:12",
        rate: 18.0,
        amount: 583.2
    };

    const transactionId = sessionData.transactionId;
    const energyCost = Math.round(sessionData.energy * sessionData.rate * 100) / 100;
    const peakFee = 50.0; // Flat peak fee in INR
    const gstTax = Math.round((energyCost + peakFee) * 0.18 * 100) / 100; // 18% tax
    const totalCost = Math.round((energyCost + peakFee + gstTax) * 100) / 100;

    const handlePayment = async () => {
        if (paying) return;
        setPaying(true);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to complete the transaction.");
            setPaying(false);
            return;
        }

        // Bypassing / Mocking check if no real transaction ID was registered (fallback scenario)
        if (!transactionId || transactionId === 9999) {
            const bypass = confirm("No real transaction session detected. Simulate mock payment success?");
            if (bypass) {
                navigate("/user/success", { state: { amount: totalCost, energy: sessionData.energy } });
            }
            setPaying(false);
            return;
        }

        try {
            // 1. Create Order
            const orderRes = await fetch(`${API_URL}/payments/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ transaction_id: transactionId })
            });

            if (!orderRes.ok) {
                const errData = await orderRes.json();
                alert(`Failed to initiate payment order: ${errData.detail || orderRes.statusText}`);
                setPaying(false);
                return;
            }

            const orderData = await orderRes.json();

            // 2. Configure Razorpay
            const options = {
                key: orderData.key_id,
                amount: orderData.amount * 100, // paise
                currency: orderData.currency,
                name: "VoltGrid Charging",
                description: `Payment for Charging Session #${transactionId}`,
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch(`${API_URL}/payments/verify-payment`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                transaction_id: transactionId,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (verifyRes.ok) {
                            alert("🎉 Payment successfully captured and verified!");
                            navigate("/user/success", { state: { amount: totalCost, energy: sessionData.energy } });
                        } else {
                            const err = await verifyRes.json();
                            alert(err.detail || "Payment verification failed.");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("Network error during payment verification.");
                    } finally {
                        setPaying(false);
                    }
                },
                prefill: {
                    name: "",
                    email: ""
                },
                theme: {
                    color: "#22c55e"
                }
            };

            const rzp = new (window as any).Razorpay(options);

            rzp.on("payment.failed", function (resp: any) {
                alert(`Payment process failed: ${resp.error.description}`);
                setPaying(false);
            });

            rzp.open();

        } catch (e: any) {
            console.error("Error triggering checkout:", e);
            const bypass = confirm("Razorpay checkout failed to load. Do you want to simulate a successful payment bypass?");
            if (bypass) {
                try {
                    const bypassRes = await fetch(`${API_URL}/payments/verify-payment`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            transaction_id: transactionId,
                            razorpay_order_id: `order_mock_${transactionId}_bypass`,
                            razorpay_payment_id: `pay_mock_${transactionId}_bypass`,
                            razorpay_signature: "mock_signature_success"
                        })
                    });
                    if (bypassRes.ok) {
                        alert("🎉 Simulated bypass payment verification accepted!");
                        navigate("/user/success", { state: { amount: totalCost, energy: sessionData.energy } });
                    } else {
                        alert("Simulated bypass payment verify failed.");
                    }
                } catch (err) {
                    console.error("Bypass verify error:", err);
                }
            }
            setPaying(false);
        }
    };

    return (
        <div className="space-y-6 font-sans max-w-md mx-auto py-4">
            <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 grid place-items-center mx-auto">
                    <FileText className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Charging Session Invoice</h1>
                <p className="text-slate-400 text-sm">Review your session calculations before billing</p>
            </div>

            <div className="border border-card-border bg-card rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center text-xs text-slate-450 uppercase tracking-widest pb-3 border-b border-card-border">
                    <span>Billing Parameter</span>
                    <span>Value</span>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Energy Consumption</span>
                        <span className="font-semibold text-white">{sessionData.energy} kWh</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Charging Duration</span>
                        <span className="font-semibold text-white">{sessionData.time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Base Rate</span>
                        <span className="font-semibold text-white">₹{sessionData.rate} / kWh</span>
                    </div>

                    <div className="border-t border-card-border/60 my-2 pt-2 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Energy Charges</span>
                            <span className="font-semibold text-white">₹{energyCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Grid Peak Demand Fee</span>
                            <span className="font-semibold text-white">₹{peakFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Unified Utility Tax (18% GST)</span>
                            <span className="font-semibold text-white">₹{gstTax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t border-card-border pt-4 flex justify-between items-center text-base font-extrabold text-white">
                        <span>Total Payable</span>
                        <span className="text-xl text-primary glow-primary font-black flex items-center gap-0.5">
                            <IndianRupee className="h-4 w-4" />
                            <span>{totalCost.toFixed(2)}</span>
                        </span>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-extrabold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all glow-primary cursor-pointer select-none"
                >
                    <CreditCard className="h-4.5 w-4.5 fill-current" />
                    <span>{paying ? "Initiating Gateway..." : "Pay Invoice"}</span>
                </button>
            </div>

            <div className="text-center">
                <Link to="/user/dashboard" className="text-xs text-slate-405 hover:text-white">
                    Cancel and report billing issue
                </Link>
            </div>
        </div>
    );
}

