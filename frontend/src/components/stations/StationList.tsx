import React from "react";
import type { Station } from "../../data/stations";
import StationCard from "./StationCard";
import { Search, Info, SlidersHorizontal, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StationListProps {
    stations: Station[];
    loading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterStatus: "all" | "available" | "charging" | "offline";
    setFilterStatus: (status: "all" | "available" | "charging" | "offline") => void;
    selectedStationId: number | null;
    onSelectStation: (station: Station) => void;
    userLocation?: [number, number] | null;
}

// Visual Shimmer Loader representation to simulate live server sync loads
function StationCardSkeleton() {
    return (
        <div className="p-4 rounded-xl border border-card-border bg-card/65 animate-pulse space-y-3 select-none">
            <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1 pr-2">
                    <div className="h-4 bg-slate-850 rounded-md w-3/4"></div>
                    <div className="h-3 bg-slate-900 rounded-md w-1/3 mt-1.5"></div>
                </div>
                <div className="h-4.5 bg-slate-900 rounded-full w-14 shrink-0"></div>
            </div>

            <div className="h-8 bg-slate-900/50 rounded-md w-full"></div>

            <div className="flex items-center gap-4 pt-1">
                <div className="h-3 bg-slate-850 rounded-sm w-12"></div>
                <div className="h-3 bg-slate-850 rounded-sm w-10"></div>
                <div className="h-3 bg-slate-850 rounded-sm w-14"></div>
            </div>
        </div>
    );
}

export default function StationList({
    stations,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    selectedStationId,
    onSelectStation,
    userLocation
}: StationListProps) {
    const filterOptions: { label: string; value: typeof filterStatus; countColor: string }[] = [
        { label: "All", value: "all", countColor: "bg-slate-800 text-slate-300" },
        { label: "Available", value: "available", countColor: "bg-emerald-500/20 text-emerald-400" },
        { label: "Charging", value: "charging", countColor: "bg-blue-500/20 text-blue-400" },
        { label: "Offline", value: "offline", countColor: "bg-red-500/20 text-red-400" }
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Search Input bar */}
            <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city or station name..."
                    className="w-full bg-card border border-card-border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
            </div>

            {/* Filter chips list */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide shrink-0">
                {filterOptions.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setFilterStatus(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 uppercase tracking-wider ${filterStatus === opt.value
                            ? "bg-primary text-primary-foreground border-transparent shadow-xs shadow-primary/10"
                            : "border-card-border bg-card text-slate-400 hover:text-slate-200 hover:border-slate-800"
                            }`}
                    >
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>

            {/* Scrollable list items panel */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[520px] lg:max-h-[calc(100vh-270px)] min-h-[300px]">
                {loading ? (
                    // Render 4 load cards while fetching
                    Array.from({ length: 4 }).map((_, idx) => (
                        <StationCardSkeleton key={idx} />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {stations.length > 0 ? (
                            stations.map((st) => (
                                <motion.div
                                    key={st.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <StationCard
                                        station={st}
                                        isSelected={selectedStationId === st.id}
                                        onSelect={() => onSelectStation(st)}
                                        userLocation={userLocation}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 px-4 text-center border border-dashed border-card-border rounded-xl space-y-3"
                            >
                                <ShieldAlert className="h-10 w-10 text-slate-500 mx-auto" />
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-slate-355 text-white">No stations found</h4>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                        No chargers match your search queries. Try adjusting search criteria or selecting other filter badges.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
