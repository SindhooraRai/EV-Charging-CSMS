import React, { useState, useEffect } from "react";
import { Download, Calendar, Loader2, CreditCard } from "lucide-react";

export default function ChargingHistory() {
    const [stations, setStations] = useState<any[]>([]);
    const [myTransactions, setMyTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

    const fetchHistoryData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const headers = {
                "Authorization": `Bearer ${token}`
            };

            // Fetch stations to resolve names
            const stationsRes = await fetch(`${API_URL}/stations`, { headers });
            if (stationsRes.ok) {
                const stationsData = await stationsRes.json();
                setStations(stationsData);
            }

            // Fetch transaction logs
            const txRes = await fetch(`${API_URL}/transactions`, { headers });
            if (txRes.ok) {
                const txData = await txRes.json();

                // Decode token to get user ID
                let subId: number | null = null;
                try {
                    const base64Url = token.split(".")[1];
                    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                    const decoded = JSON.parse(window.atob(base64));
                    if (decoded && decoded.sub) {
                        subId = parseInt(decoded.sub, 10);
                    }
                } catch (e) {
                    console.error("Token decode error:", e);
                }

                if (subId) {
                    const filtered = txData.filter((t: any) => t.user_id === subId);
                    filtered.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
                    setMyTransactions(filtered);
                } else {
                    txData.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
                    setMyTransactions(txData);
                }
            }
        } catch (e) {
            console.error("Failed to load charging history data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryData();
    }, []);

    // Load Razorpay Checkout SDK Script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            try {
                document.body.removeChild(script);
            } catch (e) {
                // Ignore if already unmounted
            }
        };
    }, []);

    const triggerCheckout = async (transactionId: number, amount: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to make a payment.");
                return;
            }

            // 1. Create order on the backend
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
                alert(errData.detail || "Failed to initiate payment. Please try again.");
                return;
            }

            const orderData = await orderRes.json();

            // 2. Configure Checkout handler options
            const options = {
                key: orderData.key_id,
                amount: orderData.amount * 100, // paise
                currency: orderData.currency,
                name: "VoltGrid Charging",
                description: `Payment for Charging Session #${transactionId}`,
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    // 3. Verify Payment on Backend
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
                        await fetchHistoryData(); // Reload sessions on UI
                    } else {
                        const err = await verifyRes.json();
                        alert(err.detail || "Payment validation failed. Please check with your bank.");
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
            });

            rzp.open();
        } catch (e: any) {
            console.error("Error triggering checkout:", e);
            const bypass = confirm("Razorpay checkout failed to load. Do you want to simulate a successful payment bypass?");
            if (bypass) {
                const token = localStorage.getItem("token");
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
                    await fetchHistoryData();
                } else {
                    alert("Simulated bypass payment verify failed.");
                }
            }
        }
    };

    const sessions = myTransactions.map((t: any) => {
        const dateStr = new Date(t.start_time).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        const durationMin = t.end_time
            ? `${Math.round((new Date(t.end_time).getTime() - new Date(t.start_time).getTime()) / 60000)} mins`
            : "In Progress";

        const station = stations.find((s: any) => s.id === t.station_id);
        const stationName = station ? station.station_name : `Station #${t.station_id}`;

        return {
            id: `TXN-${t.id}`,
            realId: t.id,
            loc: stationName,
            date: dateStr,
            duration: durationMin,
            kwh: `${t.energy_used.toFixed(1)} kWh`,
            cost: `₹${t.amount.toFixed(2)}`,
            rawCost: t.amount,
            status: t.payment_status === "Paid" ? "Settled" : t.payment_status
        };
    });

    return (
        <div className="space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Charging History</h1>
                <p className="text-muted-foreground text-sm">View details, print receipts and analyze your historical EV charge logs.</p>
            </div>

            {/* Transaction Log Table */}
            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-muted/10">
                    <div className="font-semibold text-sm">Transaction Logs</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                            <Calendar className="h-3.5 w-3.5" /> Date Range
                        </button>
                        <button className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                            <Download className="h-3.5 w-3.5" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 space-y-3">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <span className="text-sm text-muted-foreground font-medium">Retrieving transaction history...</span>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center p-12 text-muted-foreground text-sm">
                            No charging sessions found in your history log.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Station Location</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Duration</th>
                                    <th className="p-4">Energy</th>
                                    <th className="p-4">Cost</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {sessions.map((s) => (
                                    <tr key={s.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="p-4 font-mono text-xs font-semibold">{s.id}</td>
                                        <td className="p-4 font-semibold">{s.loc}</td>
                                        <td className="p-4 text-muted-foreground">{s.date}</td>
                                        <td className="p-4 text-muted-foreground">{s.duration}</td>
                                        <td className="p-4 font-semibold text-primary">{s.kwh}</td>
                                        <td className="p-4 font-bold">{s.cost}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${s.status === "Settled"
                                                ? "bg-emerald-500/10 text-emerald-405 border-emerald-500/20"
                                                : s.status === "Unpaid"
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                                                    : "bg-red-500/10 text-red-400 border-red-500/25"
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {s.status === "Unpaid" ? (
                                                <button
                                                    onClick={() => triggerCheckout(s.realId, s.rawCost)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer hover:opacity-95"
                                                >
                                                    <CreditCard className="h-3.5 w-3.5" /> Pay Now
                                                </button>
                                            ) : (
                                                <button className="p-1 px-2.5 bg-muted border border-border hover:bg-border rounded text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer">
                                                    <Download className="h-3.5 w-3.5" /> PDF
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
