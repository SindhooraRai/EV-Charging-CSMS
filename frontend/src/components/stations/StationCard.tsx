import React from "react";
import type { Station } from "../../data/stations";
import { MapPin, Battery, Star, Navigation, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface StationCardProps {
    station: Station;
    isSelected: boolean;
    onSelect: () => void;
    userLocation?: [number, number] | null;
}

export default function StationCard({ station, isSelected, onSelect, userLocation }: StationCardProps) {
    // Determine status badge color
    const getStatusColor = (status: Station["status"]) => {
        switch (status) {
            case "available":
                return "bg-emerald-500/10 text-emerald-450 border-emerald-500/25";
            case "charging":
                return "bg-blue-500/10 text-blue-400 border-blue-500/25";
            case "offline":
                return "bg-red-500/10 text-red-400 border-red-500/25";
            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/25";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={onSelect}
            className={`p-4 rounded-xl border bg-card cursor-pointer flex flex-col justify-between transition-all select-none hover:shadow-md ${isSelected
                ? "border-primary/80 bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                : "border-card-border hover:border-slate-700/60"
                }`}
        >
            <div className="space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <h4 className="font-semibold text-sm leading-snug tracking-tight text-white hover:text-primary transition-all">
                            {station.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="text-[11px] truncate">{station.city}</span>
                        </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase border shrink-0 ${getStatusColor(station.status)}`}>
                        {station.status}
                    </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {station.address}
                </p>

                {/* Port lists and stats */}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 items-center pt-1 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                        <Battery className="h-3.5 w-3.5 text-primary" />
                        <span>{station.availableChargers}/{station.totalChargers} Available</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-yellow-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{station.rating}</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-emerald-450 font-semibold">
                        ₹{station.pricePerKwh}/kWh
                    </span>
                </div>
            </div>

            <div className="flex gap-2 pt-3 mt-2 border-t border-card-border/80" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] text-slate-400 self-center">
                    Updated: {station.lastUpdated}
                </span>

                <div className="flex gap-2 ml-auto">
                    {station.status === "available" && (
                        <a
                            href={userLocation
                                ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${station.lat},${station.lng}`
                                : `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-primary hover:opacity-90 transition-all rounded-md text-primary-foreground flex items-center justify-center shadow-xs"
                            title="Navigate"
                        >
                            <Navigation className="h-3.5 w-3.5" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
