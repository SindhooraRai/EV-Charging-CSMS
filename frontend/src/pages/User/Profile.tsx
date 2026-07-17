import React, { useState } from "react";
import { User, Mail, Phone, Car, Check, Upload, CreditCard } from "lucide-react";

export default function Profile() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    // Helper to parse vehicle string format
    const parseVehicle = (vehicleStr: string) => {
        if (!vehicleStr) return { brand: "Nissan", model: "Leaf", variant: "e+", capacity: "62" };
        if (vehicleStr.includes(":")) {
            const parts = vehicleStr.split(":").map(s => s.trim());
            return {
                brand: parts[0] || "",
                model: parts[1] || "",
                variant: parts[2] || "",
                capacity: parts[3] || ""
            };
        } else {
            const match = vehicleStr.match(/^([^\s]+)\s+([^\s]+)\s+([^\(]+)(?:\((\d+)(?:\s*kWh)?\))?/i);
            if (match) {
                return {
                    brand: match[1] || "",
                    model: match[2] || "",
                    variant: match[3]?.trim() || "",
                    capacity: match[4] || ""
                };
            }
            return { brand: vehicleStr, model: "", variant: "", capacity: "" };
        }
    };

    const initialVehicle = parseVehicle(user?.vehicle || "Nissan Leaf e+ (62 kWh)");

    const [name, setName] = useState(user?.name || "John Doe");
    const [email, setEmail] = useState(user?.email || "driver@voltgrid.com");
    const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");

    // Separate states for vehicle specifications
    const [brand, setBrand] = useState(initialVehicle.brand);
    const [model, setModel] = useState(initialVehicle.model);
    const [variant, setVariant] = useState(initialVehicle.variant);
    const [capacity, setCapacity] = useState(initialVehicle.capacity);

    // Additional EV specs
    const [vehicleNo, setVehicleNo] = useState(user?.vehicleNo || "KA-20-AB-1234");
    const [connectorType, setConnectorType] = useState(user?.connectorType || "CCS2");
    const [maxSpeed, setMaxSpeed] = useState(user?.maxSpeed || "50 kW");
    const [prefStation, setPrefStation] = useState(user?.prefStation || "Station 4 - Mall of India");

    // Avatar picture configurations
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    const [rfidLinked, setRfidLinked] = useState(() => {
        const stored = localStorage.getItem("rfidLinked");
        return stored !== "false"; // default true
    });

    const [isSaved, setIsSaved] = useState(false);

    const presetAvatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    ];

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const vehicleStr = `${brand.trim()}: ${model.trim()}: ${variant.trim()}: ${capacity.toString().trim()}`;
        const userStrVal = localStorage.getItem("user");
        if (userStrVal) {
            const userObj = JSON.parse(userStrVal);
            localStorage.setItem("user", JSON.stringify({
                ...userObj,
                name,
                phone,
                vehicle: vehicleStr,
                vehicleNo,
                connectorType,
                maxSpeed,
                prefStation,
                avatar
            }));
            // Trigger storage event so other components receive the update immediately
            window.dispatchEvent(new Event("storage"));
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="space-y-4 font-sans max-w-5xl mx-auto pb-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Driver Profile</h1>
                <p className="text-muted-foreground text-xs">Manage personal information, contact credentials, and vehicle specifications.</p>
            </div>

            {/* Profile Avatar Selection Frame */}
            <div className="p-5 border border-border bg-card rounded-2xl shadow-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left Column (SPAN 5): Avatar, Stats, RFID, Contact Info */}
                        <div className="lg:col-span-5 space-y-4">

                            <div className="flex items-center justify-between gap-4 bg-muted/5 p-3 rounded-xl border border-border/40 relative">
                                <div className="flex items-center gap-3">
                                    <div className="relative group shrink-0">
                                        {avatar ? (
                                            <img
                                                src={avatar}
                                                alt="Profile Avatar"
                                                className="h-12 w-12 rounded-full object-cover border border-primary/30"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-primary/10 border border-primary/25 rounded-full grid place-items-center text-primary text-base font-bold font-[family-name:var(--font-display)]">
                                                {name
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2) || "U"}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                            className="absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground hover:opacity-95 rounded-full border border-card shadow-md cursor-pointer select-none"
                                        >
                                            <Upload className="h-2.5 w-2.5" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base leading-none text-foreground">{name}</h3>
                                        <p className="text-[10px] text-muted-foreground mt-1">Tier: VoltPremium Operator</p>
                                    </div>
                                </div>

                                {showAvatarPicker && (
                                    <div className="absolute top-14 left-0 z-10 p-2.5 bg-card border border-border rounded-xl flex flex-col gap-1.5 shadow-xl">
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">Avatar Selection</span>
                                        <div className="flex items-center gap-1.5">
                                            {presetAvatars.map((url, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => {
                                                        setAvatar(url);
                                                        setShowAvatarPicker(false);
                                                    }}
                                                    className="h-7 w-7 rounded-full overflow-hidden border border-border hover:border-primary active:scale-95 transition-all cursor-pointer"
                                                >
                                                    <img src={url} className="h-full w-full object-cover" alt="" />
                                                </button>
                                            ))}
                                            <label className="h-7 w-7 bg-muted border border-border hover:border-primary active:scale-95 transition-all rounded-full flex items-center justify-center cursor-pointer">
                                                <Upload className="h-3 w-3 text-muted-foreground" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        handleAvatarUpload(e);
                                                        setShowAvatarPicker(false);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Statistics Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-muted/10 border border-border/50 p-2.5 rounded-xl flex flex-col justify-between">
                                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Sessions</span>
                                    <span className="text-lg font-extrabold text-foreground mt-0.5">18</span>
                                </div>
                                <div className="bg-muted/10 border border-border/50 p-2.5 rounded-xl flex flex-col justify-between">
                                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Energy</span>
                                    <span className="text-lg font-extrabold text-primary mt-0.5">142 kWh</span>
                                </div>
                                <div className="bg-muted/10 border border-border/50 p-2.5 rounded-xl flex flex-col justify-between">
                                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Savings</span>
                                    <span className="text-lg font-extrabold text-emerald-400 mt-0.5">₹1,250</span>
                                </div>
                            </div>

                            {/* RFID Status Card */}
                            <div className="bg-muted/10 border border-border/50 p-3.5 rounded-xl">
                                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                                    <div>
                                        <span className="block text-xs font-semibold">RFID Key status</span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <CreditCard className="h-3 w-3 text-primary animate-pulse" /> voltgrid core client badge
                                        </span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase border ${rfidLinked
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-zinc-500/10 text-muted-foreground border-zinc-500/20"
                                        }`}>
                                        {rfidLinked ? "Linked" : "Unpaired"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2.5">
                                    <div>
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Card ID</span>
                                        <span className="block font-mono text-xs tracking-wider text-foreground mt-0.5">
                                            {rfidLinked ? "VOLT-9827-X1" : "Not Paired"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = !rfidLinked;
                                            setRfidLinked(next);
                                            localStorage.setItem("rfidLinked", next.toString());
                                        }}
                                        className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 text-[10px] font-bold rounded-lg border border-border text-foreground transition-all cursor-pointer select-none"
                                    >
                                        {rfidLinked ? "Unlink" : "Link RFID"}
                                    </button>
                                </div>
                            </div>

                            {/* Personal Info Box */}
                            <div className="bg-muted/10 border border-border/50 p-3.5 rounded-xl space-y-3">
                                <div>
                                    <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full bg-muted/5 border border-border/30 text-muted-foreground rounded-lg py-1.5 px-3 text-xs cursor-not-allowed font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mobile Phone</label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column (SPAN 7): EV Information Configuration & Preferred charging option & Save buttons */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                            <div className="bg-muted/10 p-4 rounded-xl border border-border/80 space-y-3.5">
                                <h4 className="text-xs font-bold flex items-center gap-1.5 text-foreground pb-1.5 border-b border-border/40">
                                    <Car className="h-3.5 w-3.5 text-primary" /> EV Specifications & Station Preferences
                                </h4>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Brand</label>
                                        <input
                                            type="text"
                                            value={brand}
                                            onChange={(e) => setBrand(e.target.value)}
                                            placeholder="Tata"
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-foreground"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Model</label>
                                        <input
                                            type="text"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            placeholder="Nexon EV"
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-foreground"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Variant</label>
                                        <input
                                            type="text"
                                            value={variant}
                                            onChange={(e) => setVariant(e.target.value)}
                                            placeholder="Max"
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Capacity (kWh)</label>
                                        <input
                                            type="number"
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                            placeholder="40.5"
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-foreground"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Vehicle License Number</label>
                                        <input
                                            type="text"
                                            value={vehicleNo}
                                            onChange={(e) => setVehicleNo(e.target.value)}
                                            placeholder="KA-20-AB-1234"
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Connector</label>
                                        <select
                                            value={connectorType}
                                            onChange={(e) => setConnectorType(e.target.value)}
                                            className="w-full bg-muted border border-border rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-foreground cursor-pointer"
                                        >
                                            <option value="CCS2">CCS2</option>
                                            <option value="Type 2">Type 2</option>
                                            <option value="CHAdeMO">CHAdeMO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Max speed</label>
                                        <input
                                            type="text"
                                            value={maxSpeed}
                                            onChange={(e) => setMaxSpeed(e.target.value)}
                                            placeholder="50 kW"
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-foreground"
                                        />
                                    </div>

                                    <div className="col-span-2 sm:col-span-4">
                                        <label className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Preferred Charging Station</label>
                                        <input
                                            type="text"
                                            value={prefStation}
                                            onChange={(e) => setPrefStation(e.target.value)}
                                            className="w-full bg-muted/20 border border-border rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold text-foreground"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Block */}
                            <div className="pt-4 lg:pt-0 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-all glow-primary flex items-center gap-1 cursor-pointer select-none"
                                >
                                    {isSaved ? (
                                        <>
                                            <Check className="h-3.5 w-3.5" /> Changes Saved
                                        </>
                                    ) : (
                                        "Save Profile Info"
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
