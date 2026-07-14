import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ShieldAlert, ArrowRight, Star, Battery, Navigation } from "lucide-react";

export default function NearbyChargers() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "ac" | "dc">("all");

    const stations = [
        {
            id: 1,
            name: "Connaught Place Supercharger",
            type: "DC Fast",
            power: "150 kW",
            distance: "1.2 km",
            available: "3/4 available",
            status: "available",
            address: "Outer Circle, Block E, Connaught Place, New Delhi",
            rating: 4.8,
        },
        {
            id: 2,
            name: "Mall of India Level 2 Charging",
            type: "AC Charger",
            power: "22 kW",
            distance: "4.5 km",
            available: "0/8 available",
            status: "occupied",
            address: "Sector 18, Noida, Uttar Pradesh",
            rating: 4.5,
        },
        {
            id: 3,
            name: "Airport Terminal 3 Hub",
            type: "DC Ultra",
            power: "350 kW",
            distance: "8.1 km",
            available: "6/6 available",
            status: "available",
            address: "T3 Departure Road, Indira Gandhi Intl Airport, Delhi",
            rating: 4.9,
        },
        {
            id: 4,
            name: "Vasant Kunj Community Charger",
            type: "AC Charger",
            power: "7.4 kW",
            distance: "6.0 km",
            available: "Offline",
            status: "offline",
            address: "Pocket 1, Sector B, Vasant Kunj, New Delhi",
            rating: 3.9,
        }
    ];

    const filteredStations = stations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.address.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterType === "all") return matchesSearch;
        if (filterType === "ac") return matchesSearch && station.type.startsWith("AC");
        if (filterType === "dc") return matchesSearch && station.type.startsWith("DC");
        return matchesSearch;
    });

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Charging Network Map</h1>
                    <p className="text-muted-foreground text-sm">Find and navigate to the nearest active charging point.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterType === "all" ? "bg-primary text-primary-foreground border-transparent" : "border-border bg-card text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType("dc")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterType === "dc" ? "bg-primary text-primary-foreground border-transparent" : "border-border bg-card text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        DC Fast (50kW+)
                    </button>
                    <button
                        onClick={() => setFilterType("ac")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterType === "ac" ? "bg-primary text-primary-foreground border-transparent" : "border-border bg-card text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        AC Chargers
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Search list */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search station or locality..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                        {filteredStations.length > 0 ? (
                            filteredStations.map((station) => (
                                <div key={station.id} className="p-4 bg-card border border-border hover:border-primary/40 rounded-xl transition-all space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className="font-semibold text-sm leading-tight">{station.name}</h4>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <MapPin className="h-3 w-3 shrink-0" /> {station.distance} away
                                            </p>
                                        </div>

                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${station.status === "available"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : station.status === "occupied"
                                                    ? "bg-amber-500/10 text-amber-400"
                                                    : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {station.available}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Battery className="h-3.5 w-3.5 text-primary" /> {station.power}</span>
                                        <span className="flex items-center gap-1 text-amber-450"><Star className="h-3.5 w-3.5 fill-current" /> {station.rating}</span>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        <Link
                                            to={`/user/stations/${station.id}`}
                                            className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-muted/30 border border-border hover:bg-muted/70 rounded-lg text-xs font-semibold transition-all"
                                        >
                                            Details <ArrowRight className="h-3 w-3" />
                                        </Link>
                                        {station.status === "available" && (
                                            <Link
                                                to="/user/live"
                                                className="py-1.5 px-3 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-all glow-primary flex items-center gap-1"
                                            >
                                                <Navigation className="h-3 w-3" /> Navigate
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center border border-dashed border-border rounded-xl">
                                <ShieldAlert className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <span className="text-sm font-semibold text-muted-foreground block">No chargers found</span>
                                <span className="text-xs text-muted-foreground/60 block mt-1">Try resetting filters to show offline units.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Placeholder Graphic */}
                <div className="lg:col-span-3 h-[500px] border border-border bg-muted/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none">
                    <div className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none" style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77.209,28.613,10,0/800x600?access_token=placeholder')` }}>
                        {/* Grid overlay lines to look like simulated dashboard */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background"></div>
                        <div className="absolute inset-0 bg-radial-gradient"></div>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="h-14 w-14 rounded-full bg-primary/20 text-primary grid place-items-center mx-auto glow-primary">
                            <MapPin className="h-7 w-7 text-primary animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Interactive GPS Charging Station Router</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                                Live coordinate syncing with charging units. Navigation connects automatically to Google Maps or Apple Maps API links.
                            </p>
                        </div>
                        <div className="p-3 bg-card/90 border border-border rounded-xl inline-flex flex-col text-left gap-1.5 shadow-xl max-w-xs">
                            <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Select Active Unit</div>
                            <div className="text-xs font-semibold flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary"></span> Station 1 (CP Supercharger)</div>
                            <div className="text-[10px] text-muted-foreground">Lat: 28.6139° N, Lon: 77.2090° E</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
