import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Terminal as TermIcon, ShieldAlert, Cpu, Heart, CheckCircle } from "lucide-react";

export default function AdminStationDetails() {
    const { id } = useParams();
    const [terminalLogs, setTerminalLogs] = useState([
        { time: "18:32:01", type: "IN", action: "Heartbeat.req", payload: "{}" },
        { time: "18:32:01", type: "OUT", action: "Heartbeat.conf", payload: '{"currentTime": "2026-07-14T18:32:01Z"}' },
        { time: "18:30:15", type: "IN", action: "StatusNotification.req", payload: '{"connectorId": 2, "status": "Occupied", "errorCode": "NoError"}' },
        { time: "18:30:15", type: "OUT", action: "StatusNotification.conf", payload: "{}" },
        { time: "18:29:40", type: "IN", action: "Authorize.req", payload: '{"idTag": "VOLT-9827-X1"}' },
        { time: "18:29:41", type: "OUT", action: "Authorize.conf", payload: '{"idTagInfo": {"status": "Accepted"}}' }
    ]);

    const [inputVal, setInputVal] = useState("");

    const station = {
        id: id || "1",
        name: "Connaught Place Supercharger Hub",
        vendor: "VoltGrid Chargers Corp",
        model: "VGRID-FAST-150-GT",
        serial: "VG-29381-82736",
        firmware: "v2.0.4",
        status: "Online",
        ip: "192.168.1.42",
        port: "9000",
        chargePointModel: "VoltGrid Ultra v2",
        uptime: "99.8%"
    };

    const handleSendCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputVal.trim()) return;

        const newLog = {
            time: new Date().toTimeString().split(" ")[0],
            type: "OUT",
            action: "TriggerMessage.req",
            payload: JSON.stringify({ requestedMessage: inputVal.trim() })
        };

        setTerminalLogs(prev => [newLog, ...prev]);
        setInputVal("");

        setTimeout(() => {
            const responseLog = {
                time: new Date().toTimeString().split(" ")[0],
                type: "IN",
                action: "TriggerMessage.conf",
                payload: JSON.stringify({ status: "Accepted" })
            };
            setTerminalLogs(prev => [responseLog, ...prev]);
        }, 600);
    };

    return (
        <div className="space-y-6 font-sans max-w-5xl mx-auto">
            <div>
                <Link to="/admin/stations" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-4">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Charger Nodes List
                </Link>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{station.name}</h1>
                        <p className="text-muted-foreground text-sm">Hardware Node Configuration and Live Diagnostic Terminal</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-xs font-semibold rounded-full select-none">
                        OCPP Protocol: Active-TLS
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Technical Specification details */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-4 shadow-lg">
                        <h3 className="font-bold text-sm border-b border-border pb-2 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-primary" /> Technical Profile
                        </h3>
                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">Manufacturer</span> <span className="font-semibold">{station.vendor}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Model Name</span> <span className="font-semibold">{station.model}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Serial Number</span> <span className="font-mono">{station.serial}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Firmware Release</span> <span className="font-mono">{station.firmware}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">IP Socket Configuration</span> <span className="font-mono text-primary">{station.ip}:{station.port}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">System Uptime</span> <span className="font-semibold">{station.uptime}</span></div>
                        </div>
                    </div>
                </div>

                {/* OCPP Logging terminal simulator */}
                <div className="lg:col-span-3 p-5 border border-border bg-card rounded-2xl flex flex-col h-[400px]">
                    <h3 className="font-bold text-sm pb-2 border-b border-border flex items-center gap-2 mb-4 shrink-0">
                        <TermIcon className="h-4 w-4 text-emerald-450" /> OCCP Transaction Terminal Log
                    </h3>

                    {/* Terminal window container style */}
                    <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 p-4 font-mono text-[10px] overflow-y-auto space-y-3 scrollbar-zinc">
                        {terminalLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-2">
                                <span className="text-muted-foreground">{log.time}</span>
                                <span className={log.type === "IN" ? "text-emerald-450" : "text-primary"}>
                                    {log.type === "IN" ? "»" : "«"}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <span className="font-semibold text-foreground">{log.action}</span>
                                    <pre className="text-muted-foreground mt-0.5 whitespace-pre-wrap break-all overflow-x-hidden">{log.payload}</pre>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendCommand} className="mt-3 flex gap-2 shrink-0">
                        <input
                            type="text"
                            placeholder="Inject OCPP diagnostic schema message (e.g. Reset, UnlockConnector)..."
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary placeholder-zinc-600"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 hover:scale-102 transition-all shrink-0"
                        >
                            Inject
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
