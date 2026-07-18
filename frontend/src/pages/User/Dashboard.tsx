import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BatteryCharging,
    MapPin,
    History,
    IndianRupee,
    ArrowUpRight,
    Zap,
    Compass,
    Plus,
    Play,
    Square,
    Rss,
    Bell,
    Car,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Route,
    CreditCard,
    ArrowRight
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockStations } from "../../data/stations";

// Leaflet marker fix
const createCustomMarker = (status: "available" | "charging" | "offline") => {
    let pinColor = "#22c55e"; // green for available
    if (status === "charging") pinColor = "#06b6d4"; // cyan for charging
    if (status === "offline") pinColor = "#ef4444"; // red for offline

    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" style="filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.4));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                  fill="${pinColor}" stroke="#ffffff" stroke-width="1.8" />
        </svg>
    `;

    return L.divIcon({
        html: svgIcon,
        className: "custom-dashboard-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
    });
};

export default function UserDashboard() {
    const navigate = useNavigate();
    const [showStartTransition, setShowStartTransition] = useState(false);
    const [transitionStep, setTransitionStep] = useState("");
    const [transitionProgress, setTransitionProgress] = useState(0);
    const timeoutRefs = React.useRef<any[]>([]);

    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(clearTimeout);
        };
    }, []);

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const firstName = user?.name ? user.name.split(" ")[0] : "Driver";

    // Helper to parse vehicle string format
    const parseVehicle = (vehicleStr: string) => {
        if (!vehicleStr) return { brand: "Tesla", model: "Model 3", variant: "Long Range", capacity: "75" };
        if (vehicleStr.includes(":")) {
            const parts = vehicleStr.split(":").map(s => s.trim());
            return {
                brand: parts[0] || "Tesla",
                model: parts[1] || "Model 3",
                variant: parts[2] || "Long Range",
                capacity: parts[3] || "75"
            };
        } else {
            const match = vehicleStr.match(/^([^\s]+)\s+([^\s]+)\s+([^\(]+)(?:\((\d+)(?:\s*kWh)?\))?/i);
            if (match) {
                return {
                    brand: match[1] || "Tesla",
                    model: match[2] || "Model 3",
                    variant: match[3]?.trim() || "Long Range",
                    capacity: match[4] || "75"
                };
            }
            return { brand: vehicleStr, model: "EV", variant: "", capacity: "" };
        }
    };

    const vehicleInfo = parseVehicle(user?.vehicle);
    const vehicleName = `${vehicleInfo.brand} ${vehicleInfo.model}`;
    const vehicleNo = user?.vehicleNo || "KA-20-AB-1234";
    const connectorType = user?.connectorType || "CCS2";

    // RFID representation matching profile linked status
    const [rfidLinked, setRfidLinked] = useState(() => {
        const stored = localStorage.getItem("rfidLinked");
        return stored !== "false";
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem("rfidLinked");
            setRfidLinked(stored !== "false");
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Live Charging State
    const [isCharging, setIsCharging] = useState(false);
    const [stations, setStations] = useState<any[]>([]);
    const [myTransactions, setMyTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const headers = {
                "Authorization": `Bearer ${token}`
            };

            const stationsRes = await fetch(`${API_URL}/stations`, { headers });
            if (stationsRes.ok) {
                const stationsData = await stationsRes.json();
                setStations(stationsData);
            }

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
            console.error("Failed to load dashboard data", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const activeSession = myTransactions.find((t: any) => t.end_time === null);

    useEffect(() => {
        if (!loading) {
            setIsCharging(activeSession !== undefined);
        }
    }, [myTransactions, loading, activeSession]);

    const handleStartCharging = () => {
        setShowStartTransition(true);
        setTransitionProgress(0);
        setTransitionStep("Initializing Charging Grid...");

        timeoutRefs.current.push(setTimeout(() => {
            setTransitionProgress(33);
            setTransitionStep("Establishing Secure Grid Connection...");
        }, 800));

        timeoutRefs.current.push(setTimeout(() => {
            setTransitionProgress(66);
            setTransitionStep("VoltShield Safety Verification Approved...");
        }, 1600));

        timeoutRefs.current.push(setTimeout(() => {
            setTransitionProgress(100);
            setTransitionStep("Power Flow Initiated! Redirecting...");
        }, 2400));

        timeoutRefs.current.push(setTimeout(() => {
            setShowStartTransition(false);
            navigate("/user/live");
        }, 3200));
    };

    const [batteryPercent, setBatteryPercent] = useState(74);
    const [energyUsed, setEnergyUsed] = useState(0);
    const [chargingDuration, setChargingDuration] = useState(0); // in seconds
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [telemetry, setTelemetry] = useState({ power: 0, voltage: 0, current: 0 });

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
                        await fetchDashboardData(); // Reload recent sessions & telemetry charts
                    } else {
                        const err = await verifyRes.json();
                        alert(err.detail || "Payment validation failed. Please check with your bank.");
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || ""
                },
                theme: {
                    color: "#22c55e" // emerald green matching theme aesthetics
                }
            };

            const rzp = new (window as any).Razorpay(options);

            // Handle checkout failure
            rzp.on("payment.failed", function (resp: any) {
                alert(`Payment process failed: ${resp.error.description}`);
            });

            rzp.open();
        } catch (e: any) {
            console.error("Error triggering checkout:", e);
            // If Razorpay fails to load or open (e.g. offline local debug), enable simulation verify
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
                    await fetchDashboardData();
                } else {
                    alert("Simulated bypass payment verify failed.");
                }
            }
        }
    };

    // Handle timer greeting
    const getGreeting = () => {
        const hr = new Date().getHours();
        if (hr < 12) return "Good Morning";
        if (hr < 17) return "Good Afternoon";
        return "Good Evening";
    };
    const greeting = getGreeting();

    // Charging Simulation Loop
    useEffect(() => {
        let interval: any;
        if (isCharging) {
            if (activeSession) {
                setEnergyUsed(activeSession.energy_used || 0.0);
                setEstimatedCost(activeSession.amount || 0.0);
            }
            interval = setInterval(() => {
                setEnergyUsed(prev => prev + 0.05);
                setChargingDuration(prev => prev + 1);
                setTelemetry({
                    power: 45 + (Math.random() * 0.8 - 0.4),
                    voltage: 398 + Math.floor(Math.random() * 5),
                    current: 112 + Math.floor(Math.random() * 3)
                });
                setBatteryPercent(prev => {
                    if (prev >= 100) {
                        setIsCharging(false);
                        return 100;
                    }
                    if (Math.random() > 0.7) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 1000);
        } else {
            setTelemetry({ power: 0, voltage: 0, current: 0 });
        }
        return () => clearInterval(interval);
    }, [isCharging, activeSession]);

    // Live cost tracker calculation
    useEffect(() => {
        if (!activeSession) {
            setEstimatedCost(energyUsed * 15.0);
        }
    }, [energyUsed, activeSession]);

    // Format duration helper
    const formatDuration = (totalSecs: number) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}m`;
    };

    const stationsToRender = stations.length > 0 ? stations.map(s => {
        let city = "Mangaluru";
        const cleanName = s.station_name.toLowerCase();
        if (cleanName.includes("udupi")) city = "Udupi";
        else if (cleanName.includes("nitte") || cleanName.includes("nmamit")) city = "Nitte";
        else if (cleanName.includes("manipal")) city = "Manipal";
        else if (cleanName.includes("kundapura")) city = "Kundapura";
        else if (cleanName.includes("karkala")) city = "Karkala";

        return {
            id: s.id,
            name: s.station_name,
            city: city,
            address: s.station_name + ", Karnataka",
            status: s.status.toLowerCase() as "available" | "charging" | "offline",
            pricePerKwh: s.price_per_kwh,
            lat: s.latitude,
            lng: s.longitude
        };
    }) : mockStations.map(s => ({
        id: s.id,
        name: s.name,
        city: s.city,
        address: s.address,
        status: s.status,
        pricePerKwh: s.pricePerKwh,
        lat: s.lat,
        lng: s.lng
    }));

    const getNearestCharger = () => {
        if (stationsToRender.length === 0) return { name: "NMAMIT Hub", distance: 1.8, price: 15.0, speed: "50 kW", status: "available" as const };
        const distances = stationsToRender.map(s => {
            const dist = calculateDistance(13.1857, 74.9348, s.lat, s.lng);
            return { ...s, dist };
        });
        distances.sort((a, b) => a.dist - b.dist);
        const nearest = distances[0];
        return {
            name: nearest.name,
            distance: parseFloat(nearest.dist.toFixed(1)),
            price: nearest.pricePerKwh,
            speed: nearest.name.toLowerCase().includes("ultra") || nearest.name.toLowerCase().includes("nitte") ? "120 kW" : "50 kW",
            status: nearest.status
        };
    };
    const nearestCharger = getNearestCharger();

    const getLastSession = () => {
        const completed = myTransactions.filter((t: any) => t.end_time !== null);
        if (completed.length === 0) {
            return {
                cost: "₹0.00",
                kwh: "0 kWh",
                date: "No sessions",
                duration: "0 mins",
                status: "None"
            };
        }
        const last = completed[0];
        const dateStr = new Date(last.start_time).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        const durationMin = Math.round((new Date(last.end_time).getTime() - new Date(last.start_time).getTime()) / 60000);
        return {
            cost: `₹${last.amount.toFixed(2)}`,
            kwh: `${last.energy_used.toFixed(1)} kWh`,
            date: dateStr,
            duration: `${durationMin} mins`,
            status: "Completed"
        };
    };
    const lastSession = getLastSession();

    // Recharts Area Chart
    const chartData = [
        { date: "Jul 10", energy: 15 },
        { date: "Jul 11", energy: 28 },
        { date: "Jul 12", energy: 20 },
        { date: "Jul 13", energy: 42 },
        { date: "Jul 14", energy: 24 },
        { date: "Jul 15", energy: 48 },
        { date: "Jul 16", energy: 32 },
    ];

    const getChartData = () => {
        if (myTransactions.length === 0) return chartData;
        const result = [];
        const nowObj = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(nowObj.getDate() - i);
            const dayStr = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
            const dayTx = myTransactions.filter((t: any) => {
                if (!t.end_time) return false;
                const txDate = new Date(t.end_time);
                return txDate.getDate() === d.getDate() &&
                    txDate.getMonth() === d.getMonth() &&
                    txDate.getFullYear() === d.getFullYear();
            });
            const totalEnergyObj = dayTx.reduce((sum: number, tx: any) => sum + tx.energy_used, 0);
            result.push({
                date: dayStr,
                energy: parseFloat(totalEnergyObj.toFixed(1))
            });
        }
        return result;
    };
    const chartDataToRender = getChartData();

    // High fidelity realistic session logs
    const sessionHistory = [
        { id: 1, loc: "NMAMIT Charging Hub", date: "Jul 15, 2026", cost: "₹480.00", kwh: "32 kWh", duration: "45 mins", status: "Completed" },
        { id: 2, loc: "Mangalore EV Station", date: "Jul 13, 2026", cost: "₹660.00", kwh: "44 kWh", duration: "52 mins", status: "Completed" },
        { id: 3, loc: "Udupi Smart Charger", date: "Jul 08, 2026", cost: "₹300.00", kwh: "20 kWh", duration: "30 mins", status: "Completed" },
    ];

    const getRecentHistory = () => {
        if (myTransactions.length === 0) return sessionHistory;

        return myTransactions.slice(0, 3).map((t: any) => {
            const dateStr = new Date(t.start_time).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
            const durationMin = t.end_time
                ? `${Math.round((new Date(t.end_time).getTime() - new Date(t.start_time).getTime()) / 60000)} mins`
                : "In Progress";

            const station = stationsToRender.find((s: any) => s.id === t.station_id);
            const stationName = station ? station.name : `Station #${t.station_id}`;

            return {
                id: t.id,
                loc: stationName,
                date: dateStr,
                cost: `₹${t.amount.toFixed(2)}`,
                kwh: `${t.energy_used.toFixed(1)} kWh`,
                duration: durationMin,
                status: t.payment_status === "Paid" ? "Completed" : t.payment_status
            };
        });
    };
    const sessionHistoryToRender = getRecentHistory();

    const notifications = [
        { id: 1, text: "Charging Completed", time: "2 hours ago", type: "success" },
        { id: 2, text: "Payment Successful - Transaction #09281", time: "2 hours ago", type: "info" },
        { id: 3, text: "Station Udupi Hub is Offline next 2 hours", time: "1 day ago", type: "error" },
        { id: 4, text: "RFID Linked Successfully to VOLT-9827-X1", time: "2 days ago", type: "success" },
        { id: 5, text: "Maintenance Alert: Charger 4 scheduled update", time: "3 days ago", type: "warning" },
    ];

    const getNotifications = () => {
        const list: any[] = [];
        const offlineList = stationsToRender.filter(s => s.status === "offline");
        offlineList.forEach((s) => {
            list.push({
                id: `offline-${s.id}`,
                text: `Station ${s.name} is Offline for maintenance`,
                time: "Active alert",
                type: "error"
            });
        });

        const paidTx = myTransactions.filter(t => t.payment_status === "Paid").slice(0, 2);
        paidTx.forEach((t) => {
            list.push({
                id: `paid-${t.id}`,
                text: `Payment Successful - Transaction #${t.id}`,
                time: new Date(t.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: "info"
            });
        });

        list.push({
            id: "rfid-active",
            text: rfidLinked ? "RFID Linked Successfully to VOLT-9827-X1" : "RFID Unpaired - tap to pair card",
            time: "System",
            type: rfidLinked ? "success" : "warning"
        });

        if (list.length < 3) {
            return [...list, ...notifications.slice(0, 3 - list.length)];
        }
        return list.slice(0, 5);
    };
    const notificationsToRender = getNotifications();

    return (
        <div className="space-y-6 font-sans select-none text-foreground bg-[#05070A] min-h-[calc(100vh-6rem)] p-1">

            {/* Header / Greeting Panel */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-muted/5 p-5 rounded-[20px] border border-border/40 backdrop-blur-md">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-zinc-400 bg-clip-text text-transparent">
                        {greeting}, {firstName}
                    </h1>
                    <p className="text-muted-foreground text-xs font-medium flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Your vehicle is ready. Nearest charger is 1.8 km away. Battery {batteryPercent}%
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <Link to="/user/nearby" className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-muted/30 border border-border/80 hover:border-primary/40 font-semibold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        Find Chargers
                    </Link>
                    <button
                        onClick={() => {
                            if (isCharging) {
                                setIsCharging(false);
                            } else {
                                handleStartCharging();
                            }
                        }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer glow-primary ${isCharging
                            ? "bg-red-500/20 border border-red-500/50 text-red-400"
                            : "bg-primary text-primary-foreground hover:opacity-95"
                            }`}
                    >
                        {isCharging ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                        {isCharging ? "Stop Charge" : "Start Charging"}
                    </button>
                </div>
            </div>

            {/* Top Grid: Vehicle, Nearest Charger, Live Telemetry details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* 1. Vehicle Status Card */}
                <div className="p-5 border border-border/50 bg-card rounded-[20px] shadow-lg relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-[0_0_15px_-4px_rgba(34,197,94,0.15)] group">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Status</span>
                        <Car className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="mt-3.5">
                        <div className="text-lg font-bold text-foreground truncate">{vehicleName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{vehicleNo}</div>
                    </div>
                    <div className="mt-4 flex justify-between items-center bg-muted/10 p-2 rounded-xl border border-border/40 text-xs">
                        <span className="text-muted-foreground">Charge: <strong className="text-foreground">{batteryPercent}%</strong></span>
                        <span className="text-muted-foreground">ID: <strong className="text-foreground">{connectorType}</strong></span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${rfidLinked
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-zinc-800 text-muted-foreground border-zinc-800"
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${rfidLinked ? "bg-primary" : "bg-muted-foreground"}`}></span>
                            RFID {rfidLinked ? "Linked" : "Unpaired"}
                        </span>
                        <div className="h-5 w-12 bg-muted/30 border border-border rounded flex items-center p-0.5 relative">
                            <div className="h-full bg-primary rounded-sm transition-all duration-1000" style={{ width: `${batteryPercent}%` }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold text-foreground">{batteryPercent}%</span>
                        </div>
                    </div>
                </div>

                {/* 2. Nearest Charger Card */}
                <div className="p-5 border border-border/50 bg-card rounded-[20px] shadow-lg relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-[0_0_15px_-4px_rgba(34,197,94,0.15)] group">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Nearest Charging Station</span>
                        <Compass className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <div className="mt-3.5">
                        <div className="text-lg font-bold text-foreground">NMAMIT EV Hub</div>
                        <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-cyan-400" /> Nitte Campus • 1.8 km away
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center bg-muted/10 p-2 rounded-xl border border-border/40 text-xs">
                        <span className="text-muted-foreground">Price/kWh: <strong className="text-foreground">₹15</strong></span>
                        <span className="text-muted-foreground">Speed: <strong className="text-foreground">50 kW</strong></span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-450 border border-emerald-500/25">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Available
                        </span>
                        <Link to="/user/nearby" className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5">
                            Directions <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                {/* 3. Last Session Energy details */}
                <div className="p-5 border border-border/50 bg-card rounded-[20px] shadow-lg relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-[0_0_15px_-4px_rgba(34,197,94,0.15)] group">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Last Session Cost</span>
                        <IndianRupee className="h-4.5 w-4.5 text-primary/80 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="mt-4">
                        <div className="text-2xl font-black text-foreground">₹480.00</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Charged 32 kWh • Jul 15, 2026</p>
                    </div>
                    <div className="mt-4.5 pt-3.5 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Duration: <strong>45 mins</strong></span>
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="h-3 w-3" /> Successful
                        </span>
                    </div>
                </div>

                {/* 4. Active Charge Rate details */}
                <div className="p-5 border border-border/50 bg-card rounded-[20px] shadow-lg relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-[0_0_15px_-4px_rgba(34,197,94,0.15)] group">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active Charge Rate</span>
                        <Zap className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                    </div>
                    <div className="mt-4">
                        <div className={`text-2xl font-black ${isCharging ? "text-cyan-400 animate-pulse" : "text-foreground"}`}>
                            {isCharging ? `${telemetry.power.toFixed(1)} kW` : "0.0 kW"}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            {isCharging ? `Voltage: ${telemetry.voltage}V • Current: ${telemetry.current}A` : "Plugged Out - Standby"}
                        </p>
                    </div>
                    <div className="mt-4.5 pt-3.5 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Session time limit: <strong>None</strong></span>
                        <span className={`font-bold flex items-center gap-1 ${isCharging ? "text-cyan-400" : "text-muted-foreground"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isCharging ? "bg-cyan-400 animate-ping" : "bg-muted-foreground"}`}></span>
                            {isCharging ? "Charging Mode" : "Disconnected"}
                        </span>
                    </div>
                </div>

            </div>

            {/* Row 2: Charts and Leaflet Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Recharts Area Chart (7-day consumption logs) */}
                <div className="lg:col-span-7 p-6 border border-border/60 bg-card rounded-[20px] shadow-lg flex flex-col justify-between hover:border-primary/20 transition-all">
                    <div>
                        <h3 className="font-bold text-base flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary glow-primary"></span>
                            Weekly Charge Logs (kWh)
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Average energy utilization rate: 30.6 kWh/session</p>
                    </div>
                    <div className="h-60 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartDataToRender} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#161b22" vertical={false} />
                                <XAxis dataKey="date" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0D1117", borderColor: "#30363d", borderRadius: "12px" }}
                                    labelStyle={{ color: "#8b949e", fontSize: "11px", fontWeight: "bold" }}
                                    itemStyle={{ color: "#22C55E", fontSize: "12px", fontWeight: "bold" }}
                                />
                                <Area type="monotone" dataKey="energy" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnergy)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Leaflet Map Container */}
                <div className="lg:col-span-5 p-6 border border-border/60 bg-card rounded-[20px] shadow-lg flex flex-col justify-between hover:border-cyan-500/20 transition-all group">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="font-bold text-base flex items-center gap-2">
                                <MapPin className="h-4.5 w-4.5 text-cyan-400 group-hover:animate-bounce" />
                                Mini Karnataka Hub Map
                            </h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Plotting station states in Udupi & Mangalore</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest bg-cyan-950/20 border border-cyan-800/40 px-2 py-0.5 rounded-full select-none">
                            Live Stations
                        </span>
                    </div>

                    <div className="h-60 w-full rounded-xl overflow-hidden border border-border shadow-inner mt-1 relative z-0">
                        <MapContainer
                            center={[13.1857, 74.9348]} // Centered on NMAMIT Nitte Campus
                            zoom={9.5}
                            style={{ height: "100%", width: "100%" }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {stationsToRender.map((station) => (
                                <Marker
                                    key={station.id}
                                    position={[station.lat, station.lng]}
                                    icon={createCustomMarker(station.status)}
                                >
                                    <Popup className="custom-popup">
                                        <div className="text-foreground p-1 text-xs">
                                            <div className="font-bold text-sm text-foreground">{station.name}</div>
                                            <div className="text-muted-foreground mt-0.5">{station.address}</div>
                                            <div className="mt-2 flex justify-between items-center text-[10px]">
                                                <span className={`px-2 py-0.5 rounded uppercase font-bold ${station.status === "available" ? "bg-emerald-500/10 text-emerald-400" :
                                                    station.status === "charging" ? "bg-cyan-500/10 text-cyan-400" : "bg-red-500/10 text-red-400"
                                                    }`}>
                                                    {station.status}
                                                </span>
                                                <strong className="text-foreground">₹{station.pricePerKwh}/kWh</strong>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

            </div>

            {/* Row 3: Recent sessions, Live Control Deck & Quick Actions, Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Recent Sessions table */}
                <div className="p-6 border border-border/60 bg-card rounded-[20px] shadow-lg flex flex-col justify-between hover:border-primary/10 transition-all">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-base flex items-center gap-2">
                                <History className="h-4.5 w-4.5 text-primary" />
                                Recent Activity
                            </h3>
                            <Link to="/user/history" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                                View Logs <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <p className="text-xs text-muted-foreground pb-2">Chronological list of your last completed sessions</p>
                    </div>

                    <div className="space-y-3.5 mt-2 flex-1">
                        {sessionHistoryToRender.map((sess) => (
                            <div key={sess.id} className="p-3 bg-muted/10 border border-border/40 rounded-xl flex items-center justify-between text-xs transition-all hover:bg-muted/20">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-foreground">{sess.loc}</div>
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border ${sess.status === "Completed"
                                                ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                            }`}>
                                            {sess.status === "Completed" ? "Paid" : "Unpaid"}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 text-muted-foreground/60" /> {sess.date}
                                        <span>•</span>
                                        <span>{sess.duration}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 flex flex-col items-end">
                                    <div className="font-extrabold text-foreground">{sess.cost}</div>
                                    <div className="text-[10px] text-primary/80 font-semibold">{sess.kwh}</div>
                                    {sess.status !== "Completed" && (
                                        <button
                                            onClick={() => triggerCheckout(sess.id, parseFloat(sess.cost.replace("₹", "")))}
                                            className="mt-1.5 px-2.5 py-1 font-bold text-[9px] text-primary-foreground bg-primary hover:bg-primary/95 rounded-lg border border-primary/20 transition-all cursor-pointer flex items-center gap-1 shadow-sm shadow-primary/10"
                                        >
                                            <CreditCard className="h-3 w-3" /> Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Notification Center */}
                <div className="p-6 border border-border/60 bg-card rounded-[20px] shadow-lg flex flex-col justify-between hover:border-cyan-500/10 transition-all">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-base flex items-center gap-2">
                                <Bell className="h-4.5 w-4.5 text-cyan-400" />
                                Notifications
                            </h3>
                            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                        </div>
                        <p className="text-xs text-muted-foreground pb-2">Active telemetry broadcasts and account updates</p>
                    </div>

                    <div className="space-y-3 mt-2 flex-1">
                        {notificationsToRender.map((notif) => {
                            let bulletColor = "bg-cyan-400";
                            if (notif.type === "success") bulletColor = "bg-emerald-500";
                            if (notif.type === "error") bulletColor = "bg-red-500";
                            if (notif.type === "warning") bulletColor = "bg-amber-500";

                            return (
                                <div key={notif.id} className="p-2.5 bg-muted/5 border border-border/30 rounded-lg flex items-start gap-2.5 text-xs">
                                    <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${bulletColor}`}></span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-foreground truncate">{notif.text}</p>
                                        <span className="text-[9px] text-muted-foreground mt-0.5 block">{notif.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Live Control Deck & Quick Actions (stacked) */}
                <div className="space-y-4">

                    {/* Live Charging Card */}
                    <div className={`p-5 rounded-[20px] border shadow-lg transition-all relative overflow-hidden flex flex-col justify-between ${isCharging
                        ? "border-cyan-500/40 bg-gradient-to-br from-card to-cyan-950/20"
                        : "border-border/60 bg-card hover:border-primary/20"
                        }`}>
                        <div>
                            <div className="flex justify-between items-center">
                                <h4 className="text-xs font-extrabold text-foreground uppercase tracking-widest">Live Control Deck</h4>
                                <span className={`h-2.5 w-2.5 rounded-full ${isCharging ? "bg-cyan-400 animate-ping" : "bg-muted-foreground"}`}></span>
                            </div>

                            {isCharging ? (
                                <div className="mt-3.5 space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-2xl font-black text-cyan-400 animate-pulse">{telemetry.power.toFixed(1)} kW</span>
                                        <span className="text-[10px] text-muted-foreground font-mono">⚡ DC Fast Plugged</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 bg-muted/20 p-2.5 rounded-xl text-[10px] border border-border/40 text-center font-mono">
                                        <div>
                                            <div className="text-muted-foreground text-[8px] uppercase font-bold">V</div>
                                            <div className="font-bold text-foreground">{telemetry.voltage} V</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-[8px] uppercase font-bold">I</div>
                                            <div className="font-bold text-foreground">{telemetry.current} A</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-[8px] uppercase font-bold">Energy</div>
                                            <div className="font-bold text-primary">{energyUsed.toFixed(2)} kWh</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs pt-1">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-[9px] uppercase font-bold">Elapsed</span>
                                            <span className="font-bold text-foreground">{formatDuration(chargingDuration)}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-muted-foreground text-[9px] uppercase font-bold">Est. Cost</span>
                                            <span className="font-bold text-emerald-400">₹{estimatedCost.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Animated Battery Level */}
                                    <div className="pt-2">
                                        <div className="h-5 w-full bg-muted/80 border border-border rounded-xl flex items-center p-0.5 relative overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg transition-all duration-1000 animate-pulse" style={{ width: `${batteryPercent}%` }}></div>
                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-foreground">{batteryPercent}% Battery status</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 text-center space-y-3">
                                    <div className="h-10 w-10 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground/60 border border-border/80">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-semibold text-foreground">No Active Charging Session</h5>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] mx-auto">Connect your vehicle and toggle charging flow state</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Board */}
                    <div className="p-4 border border-border/60 bg-card rounded-[20px] shadow-lg hover:border-primary/10 transition-all">
                        <h4 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/user/nearby" className="p-2.5 bg-muted/10 border border-border/60 hover:border-cyan-500/40 hover:bg-muted/20 items-center justify-center rounded-xl flex flex-col gap-1.5 transition-all text-xs font-bold text-foreground">
                                <MapPin className="h-4.5 w-4.5 text-cyan-400" />
                                Find Charger
                            </Link>
                            <button
                                onClick={() => {
                                    if (isCharging) {
                                        setIsCharging(false);
                                    } else {
                                        handleStartCharging();
                                    }
                                }}
                                className="p-2.5 bg-muted/10 border border-border/60 hover:border-primary/40 hover:bg-muted/20 items-center justify-center rounded-xl flex flex-col gap-1.5 transition-all text-xs font-bold text-foreground cursor-pointer select-none"
                            >
                                <BatteryCharging className={`h-4.5 w-4.5 ${isCharging ? "text-red-400 group-hover:rotate-12" : "text-primary"}`} />
                                {isCharging ? "Stop Charge" : "Start Charging"}
                            </button>
                            <Link to="/user/history" className="p-2.5 bg-muted/10 border border-border/60 hover:border-primary/40 hover:bg-muted/20 items-center justify-center rounded-xl flex flex-col gap-1.5 transition-all text-xs font-bold text-foreground">
                                <History className="h-4.5 w-4.5 text-zinc-400" />
                                History Log
                            </Link>
                            <Link to="/user/profile" className="p-2.5 bg-muted/10 border border-border/60 hover:border-cyan-500/40 hover:bg-muted/20 items-center justify-center rounded-xl flex flex-col gap-1.5 transition-all text-xs font-bold text-foreground">
                                <CreditCard className="h-4.5 w-4.5 text-teal-400" />
                                RFID Card Info
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

            {/* Start Charging Transition Overlay */}
            {showStartTransition && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070a]/95 backdrop-blur-xl text-center select-none p-6 animate-[fadeIn_0.3s_ease-out]">
                    <style>{`
                        @keyframes scan {
                            0% { top: -10%; }
                            50% { top: 110%; }
                            100% { top: -10%; }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                    <div className="relative mb-8">
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse scale-150"></div>
                        <div className="h-28 w-28 rounded-full border border-primary/30 flex items-center justify-center bg-[#0d1117] shadow-[0_0_50px_rgba(34,197,94,0.25)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[scan_2.5s_linear_infinite]"></div>
                            <Zap className="h-14 w-14 text-primary animate-pulse fill-primary/10 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                        </div>
                    </div>

                    <h2 className="text-xl font-extrabold text-white tracking-wide min-h-[2rem]">
                        {transitionStep}
                    </h2>

                    <div className="w-56 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden mt-5 border border-white/5 relative">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${transitionProgress}%` }}
                        ></div>
                    </div>

                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-3">
                        Awaiting VoltShield protocol execution
                    </p>
                </div>
            )}

        </div>
    );
}
