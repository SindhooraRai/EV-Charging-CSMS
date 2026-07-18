import React, { useState, useEffect, useRef } from "react";
import {
    CreditCard, Eye, EyeOff, Lock, Unlock, Plus, RefreshCw,
    Wifi, WifiOff, CheckCircle, AlertTriangle, AlertCircle, X, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RFIDCardDetails {
    linked: boolean;
    uid?: string;
    linked_since?: string;
    status?: "Active" | "Locked" | "Lost";
    holder?: string;
}

interface ToastMessage {
    id: number;
    message: string;
    type: "success" | "error" | "info";
}

export default function RFIDCard() {
    const [card, setCard] = useState<RFIDCardDetails>({ linked: false });
    const [loading, setLoading] = useState(true);
    const [showNumber, setShowNumber] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Reader & pairing states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<"scanning" | "detected" | "offline" | "timeout" | "already_linked">("scanning");
    const [detectedUid, setDetectedUid] = useState<string | null>(null);
    const [readerStatus, setReaderStatus] = useState<"Connected" | "Offline">("Connected");
    const [lastScanTime, setLastScanTime] = useState<string | null>(null);

    // Toast manager state
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Simulator drawer state
    const [showSimulator, setShowSimulator] = useState(false);
    const [simulatorUid, setSimulatorUid] = useState("04A2568B");
    const [simulatorScenario, setSimulatorScenario] = useState<"valid" | "already_linked" | "offline" | "timeout">("valid");

    // Reference to pairing poll interval
    const pollingIntervalRef = useRef<any>(null);
    const pairingTimerRef = useRef<any>(null);

    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const holderName = user?.name || "John Doe";

    // Standard static scan logs
    const [logs, setLogs] = useState([
        { date: "Jul 13, 2026 18:22", station: "Station 4 - Mall of India", action: "Authorized" },
        { date: "Jul 11, 2026 12:45", station: "Station 12 - Airport P3", action: "Authorized" },
        { date: "Jul 08, 2026 09:12", station: "Station 1 - City Center", action: "Authorized" },
    ]);

    const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    // Fetch user card details
    const fetchCardDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiBase}/rfid/card`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCard(data);
            }
        } catch (err) {
            console.error("Failed to fetch RFID card details", err);
        } finally {
            setLoading(false);
        }
    };

    // Poll reader status during pairing
    const fetchReaderStatus = async () => {
        try {
            const response = await fetch(`${apiBase}/rfid/status`);
            if (response.ok) {
                const data = await response.json();
                setReaderStatus(data.device_status);
                setLastScanTime(data.last_scan_time);

                // If in scanning step, watch if a card was detected
                if (modalStep === "scanning") {
                    if (data.status === "offline" || data.device_status === "Offline") {
                        setModalStep("offline");
                        cleanupPairing();
                    } else if (data.status === "timeout") {
                        setModalStep("timeout");
                        cleanupPairing();
                    } else if (data.status === "detected" && data.uid) {
                        setDetectedUid(data.uid);
                        // If simulating an already_linked response, route to already_linked state
                        if (simulatorScenario === "already_linked" && showSimulator) {
                            setModalStep("already_linked");
                        } else {
                            setModalStep("detected");
                        }
                        cleanupPairing();
                    }
                }
            }
        } catch (err) {
            console.error("Error polling RFID device status", err);
        }
    };

    useEffect(() => {
        fetchCardDetails();
        // Periodically poll reader connection status
        const interval = setInterval(fetchReaderStatus, 5000);
        return () => clearInterval(interval);
    }, [modalStep, simulatorScenario, showSimulator]);

    // End polling and pairing timers
    const cleanupPairing = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        if (pairingTimerRef.current) {
            clearTimeout(pairingTimerRef.current);
            pairingTimerRef.current = null;
        }
    };

    // Start scanning mode
    const handleStartLink = async () => {
        setIsModalOpen(true);
        setModalStep("scanning");
        setDetectedUid(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiBase}/rfid/start-link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 503 || errorData.detail?.includes("Offline")) {
                    setModalStep("offline");
                    return;
                }
                throw new Error(errorData.detail || "Failed to trigger pairing mode");
            }

            // Start polling the server state
            pollingIntervalRef.current = setInterval(fetchReaderStatus, 1000);

            // Timeout after 30 seconds
            pairingTimerRef.current = setTimeout(async () => {
                cleanupPairing();
                setModalStep("timeout");
                // Notify backend of timeout
                try {
                    await fetch(`${apiBase}/rfid/simulate-scan`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "timeout" })
                    });
                } catch (e) { }
            }, 30000);

        } catch (err: any) {
            cleanupPairing();
            addToast(err.message || "Failed to establish pairing grid hook", "error");
            setModalStep("offline");
        }
    };

    // Confirm link card to account
    const handleConfirmLink = async () => {
        if (!detectedUid) return;
        setIsActionLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiBase}/rfid/link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                },
                body: JSON.stringify({ uid: detectedUid })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 409 || errorData.detail?.includes("linked to another")) {
                    setModalStep("already_linked");
                    return;
                }
                throw new Error(errorData.detail || "Linking failed");
            }

            setIsModalOpen(false);
            addToast("RFID Card Linked Successfully", "success");
            fetchCardDetails();
        } catch (err: any) {
            addToast(err.message || "Association request failed", "error");
        } finally {
            setIsActionLoading(false);
        }
    };

    // Toggle Lock / Unlock
    const handleToggleLock = async () => {
        if (!card.linked) return;
        setIsActionLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiBase}/rfid/unlock-lock`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Toggle locking failed");
            }

            const data = await response.json();
            setCard(prev => ({ ...prev, status: data.new_status }));
            addToast(`RFID Card ${data.new_status === 'Locked' ? 'Locked' : 'Activated'} Successfully`, "success");
        } catch (err: any) {
            addToast(err.message || "Failed to update card Lock state", "error");
        } finally {
            setIsActionLoading(false);
        }
    };

    // Trigger simulator controls
    const triggerSimulatedSwipe = async () => {
        try {
            let statusPayload = "detected";
            let deviceStatusPayload = "Connected";

            if (simulatorScenario === "offline") {
                statusPayload = "offline";
                deviceStatusPayload = "Offline";
            } else if (simulatorScenario === "timeout") {
                statusPayload = "timeout";
            }

            await fetch(`${apiBase}/rfid/simulate-scan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: simulatorUid,
                    status: statusPayload,
                    device_status: deviceStatusPayload
                })
            });

            addToast(`Simulator scenarios injected: ${simulatorScenario.toUpperCase()}`, "info");
        } catch (e) {
            addToast("Failed to communicate scenario to backend uvicorn", "error");
        }
    };

    const handleCancel = () => {
        cleanupPairing();
        setIsModalOpen(false);
    };

    // Formatter helpers
    const maskUid = (uid: string | null | undefined) => {
        if (!uid) return "•••• ••••";
        const clean = uid.replace(/[^a-zA-Z0-9]/g, "");
        if (clean.length <= 4) return `•••• ${clean}`;
        return `•••• ${clean.substring(clean.length - 4)}`;
    };

    return (
        <div className="space-y-6 font-sans max-w-4xl mx-auto relative pb-20 px-4 sm:px-0">
            {/* Toast rendering stack */}
            <div className="fixed top-6 right-6 z-55 flex flex-col gap-3 max-w-sm pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.9 }}
                            className={`p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3 cursor-default pointer-events-auto ${toast.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                                : toast.type === "error"
                                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                                    : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                                }`}
                        >
                            {toast.type === "success" && <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />}
                            {toast.type === "error" && <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />}
                            {toast.type === "info" && <AlertTriangle className="h-5 w-5 shrink-0 text-cyan-400" />}
                            <span className="text-sm font-medium">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex flex-wrap items-center gap-2">
                        RFID Cards Management
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${readerStatus === "Connected"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : "bg-red-500/10 text-red-400 border border-red-500/25"
                            }`}>
                            {readerStatus === "Connected" ? (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
                                    Reader Status: Connected
                                </>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-450"></span>
                                    Reader Status: Offline
                                </>
                            )}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">Manage physical RFID tokens used to authorize charging at VoltGrid sockets.</p>
                </div>
                <div className="flex flex-row items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setShowSimulator(!showSimulator)}
                        className="flex-1 md:flex-none justify-center px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-750 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Simulator
                    </button>
                    <button
                        onClick={handleStartLink}
                        className="flex-1 md:flex-none justify-center px-3 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="h-4 w-4" /> Link Card
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Visa-style RFID card graphic */}
                <div className="md:col-span-2 space-y-4">
                    {loading ? (
                        <div className="aspect-[1.586/1] w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <span className="text-xs text-muted-foreground">Syncing card registers...</span>
                        </div>
                    ) : card.linked ? (
                        <div className="relative aspect-[1.586/1] w-full rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-border p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
                            {/* Tech styling background grids */}
                            <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none"></div>
                            <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex justify-between items-start z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">VoltGrid Pass</span>
                                    <span className="text-xs font-semibold text-primary mt-0.5">RFID NFC Token</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${card.status === "Locked"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : card.status === "Lost"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    }`}>
                                    {card.status || "Active"}
                                </span>
                            </div>

                            <div className="z-10">
                                <span className="block text-[8px] text-muted-foreground uppercase tracking-wider mb-1">RFID UID</span>
                                <div className="font-mono text-lg tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                    {showNumber ? card.uid : maskUid(card.uid)}
                                    <button
                                        onClick={() => setShowNumber(!showNumber)}
                                        className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
                                    >
                                        {showNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-end z-10 border-t border-border/40 pt-4">
                                <div>
                                    <span className="block text-[9px] text-muted-foreground uppercase tracking-wider">Cardholder</span>
                                    <span className="text-sm font-semibold">{card.holder || holderName}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[9px] text-muted-foreground uppercase tracking-wider">Linked Since</span>
                                    <span className="text-sm font-semibold text-foreground">{card.linked_since || "Jul 10, 2026"}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative aspect-[1.586/1] w-full rounded-2xl bg-zinc-950 border-2 border-dashed border-zinc-800 p-6 flex flex-col items-center justify-center text-center shadow-lg">
                            <CreditCard className="h-10 w-10 text-zinc-650 mb-3" />
                            <p className="text-sm font-semibold text-zinc-300">No RFID Card Linked</p>
                            <p className="text-xs text-muted-foreground max-w-xs mt-1">Please link a hardware card to configure tap-to-charge mechanics.</p>
                            <button
                                onClick={handleStartLink}
                                className="mt-4 px-3.5 py-1.5 bg-zinc-850 hover:bg-zinc-805 text-zinc-200 border border-zinc-750 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                            >
                                Get Started
                            </button>
                        </div>
                    )}

                    {/* Quick Lock controls */}
                    {card.linked && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleToggleLock}
                                disabled={isActionLoading}
                                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 ${card.status === "Locked"
                                    ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 hover:bg-emerald-500/25"
                                    : "bg-red-500/10 text-red-450 border-red-500/20 hover:bg-red-500/25"
                                    }`}
                            >
                                {isActionLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : card.status === "Locked" ? (
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
                    )}
                </div>

                {/* Scan usage logs */}
                <div className="md:col-span-3 p-6 border border-border bg-card rounded-2xl flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-border/40 pb-2">
                        <div>
                            <h3 className="font-semibold text-base">RFID Scan History</h3>
                            {lastScanTime && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">Last Reader Scan: {lastScanTime}</p>
                            )}
                        </div>
                        <button
                            onClick={fetchCardDetails}
                            className="p-1 hover:bg-zinc-800 hover:text-white text-muted-foreground rounded-lg transition-all cursor-pointer"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-3 flex-1">
                        {logs.map((log, index) => (
                            <div key={index} className="p-3 bg-muted/20 border border-border/60 rounded-xl flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm font-semibold truncate">{log.station}</div>
                                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{log.date}</div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-450 shrink-0">
                                    {log.action}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expansible Hardware Simulator Drawer Panel */}
            <AnimatePresence>
                {showSimulator && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-8 p-6 bg-zinc-950 border border-dashed border-amber-500/35 rounded-2xl shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <RefreshCw className="h-4 w-4" /> ESP32 + MFRC522 Hardware Simulator
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Simulate actual spikes, timeouts, or scanner authentication conflicts without coding raw C++ microcontrollers.</p>
                            </div>
                            <button
                                onClick={() => setShowSimulator(false)}
                                className="p-1 hover:bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-900 pt-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">UID Swipe Payload</label>
                                <input
                                    type="text"
                                    value={simulatorUid}
                                    onChange={(e) => setSimulatorUid(e.target.value)}
                                    placeholder="04A2568B"
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono focus:border-amber-500 focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Hardware Scenario</label>
                                <select
                                    value={simulatorScenario}
                                    onChange={(e) => setSimulatorScenario(e.target.value as any)}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:border-amber-500 focus:outline-none transition-colors cursor-pointer"
                                >
                                    <option value="valid">Success: Card Scanned (Valid)</option>
                                    <option value="already_linked">Fail: Card Registered on other user account</option>
                                    <option value="offline">Fail: ESP32 Hardware Offline</option>
                                    <option value="timeout">Fail: Tap Delay Timeout (30s)</option>
                                </select>
                            </div>

                            <div className="flex items-end w-full">
                                <button
                                    onClick={triggerSimulatedSwipe}
                                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2 sm:mt-0"
                                >
                                    Transmit Swipe Trigger
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RFID Pairing Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCancel}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        ></motion.div>

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="bg-zinc-950 border border-zinc-800 rounded-2xl w-[92%] sm:max-w-md p-5 sm:p-6 relative overflow-hidden shadow-2xl z-10"
                        >
                            {/* Technical grid scan aesthetics */}
                            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                            {/* Close header */}
                            <button
                                onClick={handleCancel}
                                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* STEP 1: Scanning Mode */}
                            {modalStep === "scanning" && (
                                <div className="text-center py-4 flex flex-col items-center">
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">Link RFID Card</h3>
                                    <p className="text-xs text-muted-foreground px-4 mt-2 leading-relaxed">
                                        Place your RFID card near the RFID reader to link it with your VoltGrid account.
                                    </p>

                                    {/* Rotating waves grid */}
                                    <div className="relative my-8 w-40 h-40 flex items-center justify-center">
                                        {/* Outer pulsing ring 1 */}
                                        <motion.div
                                            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                            className="absolute w-20 h-20 bg-primary/20 rounded-full border border-primary/45"
                                        ></motion.div>
                                        {/* Outer pulsing ring 2 */}
                                        <motion.div
                                            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "easeOut" }}
                                            className="absolute w-20 h-20 bg-emerald-500/10 rounded-full border border-emerald-500/25"
                                        ></motion.div>

                                        {/* Scanner Card Icon Container */}
                                        <div className="z-10 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-primary shadow-lg flex flex-col justify-center items-center">
                                            <CreditCard className="h-12 w-12 text-primary animate-pulse" />
                                            {/* Neon green pulsing bar */}
                                            <motion.div
                                                animate={{ y: [-15, 15, -15] }}
                                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                                className="w-14 h-0.5 bg-emerald-450 blur-[1px] absolute top-1/2"
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-sm font-semibold text-zinc-200">Waiting for RFID card...</span>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                            <Loader2 className="h-3 w-3 animate-spin text-primary" /> Scanning...
                                        </span>
                                    </div>

                                    <div className="mt-8 w-full">
                                        <button
                                            onClick={handleCancel}
                                            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-300 font-semibold text-sm rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Detected Success Screen */}
                            {modalStep === "detected" && (
                                <div className="text-center py-4 flex flex-col items-center">
                                    <h3 className="text-xl font-bold tracking-tight text-foreground">RFID Card Detected</h3>
                                    <p className="text-xs text-muted-foreground px-4 mt-2">
                                        The scanner successfully detected a compatible RFID card token.
                                    </p>

                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="my-6 p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    >
                                        <CheckCircle className="h-10 w-10 text-emerald-450" />
                                    </motion.div>

                                    {/* Scan Details Box */}
                                    <div className="w-full bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl text-left space-y-2 mb-6">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Card UID:</span>
                                            <span className="font-mono font-bold text-white tracking-wider">{maskUid(detectedUid)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs border-t border-zinc-850 pt-2">
                                            <span className="text-muted-foreground">Status:</span>
                                            <span className="font-semibold text-emerald-450">Ready to Link</span>
                                        </div>
                                        <div className="flex justify-between text-xs border-t border-zinc-850 pt-2">
                                            <span className="text-muted-foreground">Card Type:</span>
                                            <span className="font-semibold text-white">MIFARE Classic 1K</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 w-full">
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 font-semibold text-sm rounded-xl transition-all cursor-pointer active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmLink}
                                            disabled={isActionLoading}
                                            className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                                        >
                                            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link Card"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ERROR STATE: Already Linked to Another Account */}
                            {modalStep === "already_linked" && (
                                <div className="text-center py-4 flex flex-col items-center">
                                    <div className="my-4 p-4 bg-red-500/10 rounded-full text-red-500 border border-red-500/20">
                                        <AlertTriangle className="h-10 w-10 text-red-400" />
                                    </div>

                                    <h3 className="text-lg font-bold text-white mt-1">Already Registered</h3>
                                    <p className="text-xs text-muted-foreground px-4 mt-2 leading-relaxed">
                                        This RFID card is already linked to another account.
                                    </p>

                                    <div className="mt-8 w-full">
                                        <button
                                            onClick={handleCancel}
                                            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-100 border border-zinc-850 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ERROR STATE: Hardware Offline */}
                            {modalStep === "offline" && (
                                <div className="text-center py-4 flex flex-col items-center">
                                    <div className="my-4 p-4 bg-red-500/10 rounded-full text-red-500 border border-red-500/20">
                                        <WifiOff className="h-10 w-10 text-red-450 animate-bounce" />
                                    </div>

                                    <h3 className="text-lg font-bold text-white mt-1">RFID Reader Offline</h3>
                                    <p className="text-xs text-muted-foreground px-6 mt-2 leading-relaxed">
                                        Please connect the RFID hardware. Make sure ESP32/MFRC522 coordinates are active.
                                    </p>

                                    <div className="mt-8 w-full">
                                        <button
                                            onClick={handleCancel}
                                            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-100 border border-zinc-850 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ERROR STATE: Timeout (30s) */}
                            {modalStep === "timeout" && (
                                <div className="text-center py-4 flex flex-col items-center">
                                    <div className="my-4 p-4 bg-amber-500/10 rounded-full text-amber-500 border border-amber-500/20">
                                        <AlertCircle className="h-10 w-10 text-amber-450" />
                                    </div>

                                    <h3 className="text-lg font-bold text-white mt-1">Scan Timed Out</h3>
                                    <p className="text-xs text-muted-foreground px-6 mt-2 leading-relaxed">
                                        No RFID card detected. Please tap the card again.
                                    </p>

                                    <div className="flex gap-3 w-full mt-8">
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-850 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={handleStartLink}
                                            className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 transition-all glow-primary cursor-pointer active:scale-[0.98]"
                                        >
                                            Retry Scan
                                        </button>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
