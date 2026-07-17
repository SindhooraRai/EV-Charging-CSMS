import React, { useState, useEffect } from "react";
import { mockStations, type Station } from "../../data/stations";
import LeafletMap from "../../components/map/LeafletMap";
import StationList from "../../components/stations/StationList";
import { Compass, Info, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function NearbyChargers() {
    // Initial center is set to Udupi-Mangaluru Coastal Region coordinates
    const defaultCenter: [number, number] = [13.12, 74.85];
    const initialZoom = 10;

    const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
    const [mapZoom, setMapZoom] = useState<number>(initialZoom);
    const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

    // Lists and state filters
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "available" | "charging" | "offline">("all");
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locatingUser, setLocatingUser] = useState(false);

    // ==========================================
    // FUTURE BACKEND INTEGRATION / FASTAPI HOOK
    // ==========================================
    // To fetch charging stations from your FastAPI backend later:
    // 
    // useEffect(() => {
    //     const fetchStations = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await fetch("http://your-fastapi-backend-url/api/stations");
    //             const data = await response.json();
    //             setStations(data);
    //         } catch (error) {
    //             console.error("Failed to load stations:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchStations();
    // }, []);
    // ==========================================

    // Loading Simulation (Slightly delays loading to show visual SaaS Skeletons)
    useEffect(() => {
        const timer = setTimeout(() => {
            setStations(mockStations);
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    // Try reading browser geolocation API on startup
    useEffect(() => {
        handleLocateUser(true); // silent attempt with no auto-alert
    }, []);

    const handleLocateUser = (silent = false) => {
        if (!navigator.geolocation) {
            if (!silent) console.log("Geolocation is not supported by your browser");
            return;
        }

        setLocatingUser(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords: [number, number] = [
                    position.coords.latitude,
                    position.coords.longitude
                ];
                setUserLocation(coords);
                setMapCenter(coords);
                setMapZoom(12);
                setLocatingUser(false);
            },
            (error) => {
                if (!silent) {
                    console.log("Location permission denied/failed:", error.message);
                }
                setLocatingUser(false);
            },
            { enableHighAccuracy: true, timeout: 6000 }
        );
    };

    // Filter station list outputs
    const filteredStations = stations.filter(station => {
        const matchesWord =
            station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.address.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" ? true : station.status === filterStatus;

        return matchesWord && matchesStatus;
    });

    const handleSelectStationFromList = (station: Station) => {
        setSelectedStationId(station.id);
        setMapCenter([station.lat, station.lng]);
        setMapZoom(13); // Zoom closer on focus
    };

    const handleSelectStationFromMap = (id: number) => {
        setSelectedStationId(id);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5 h-full font-sans tracking-normal"
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-card-border pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span>Nearby Charging Points</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded">
                            OSM Engine
                        </span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">
                        Live coordinate plots across Karnataka EV power grids.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleLocateUser()}
                        disabled={locatingUser}
                        className="px-4 py-2 border border-card-border bg-card hover:bg-slate-800 text-slate-205 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer text-slate-300 disabled:opacity-50 select-none shadow-sm"
                    >
                        <Compass className={`h-4 w-4 text-primary ${locatingUser ? "animate-spin" : ""}`} />
                        <span>{locatingUser ? "Locating..." : "My Coordinates"}</span>
                    </button>

                    <button
                        onClick={() => {
                            setMapCenter(defaultCenter);
                            setMapZoom(initialZoom);
                            setSelectedStationId(null);
                        }}
                        className="px-4 py-2 border border-card-border bg-card hover:bg-slate-800 text-slate-205 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer text-slate-300 select-none shadow-sm"
                    >
                        Reset Map
                    </button>
                </div>
            </div>

            {/* Main Panel grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-auto lg:h-[calc(100vh-190px)] min-h-0 lg:min-h-[500px]">
                {/* Station search/list Sidebar panel */}
                <div className="lg:col-span-2 flex flex-col h-auto lg:h-full overflow-hidden order-2 lg:order-1">
                    <StationList
                        stations={filteredStations}
                        loading={loading}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        selectedStationId={selectedStationId}
                        onSelectStation={handleSelectStationFromList}
                        userLocation={userLocation}
                    />
                </div>

                {/* React Leaflet Interactive Map */}
                <div className="lg:col-span-3 h-[300px] sm:h-[400px] lg:h-full order-1 lg:order-2 rounded-2xl relative shadow-inner overflow-hidden border border-card-border">
                    <LeafletMap
                        stations={filteredStations}
                        center={mapCenter}
                        zoom={mapZoom}
                        selectedStationId={selectedStationId}
                        onSelectStation={handleSelectStationFromMap}
                        userLocation={userLocation}
                    />
                </div>

                {/* Floating Info alert */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 border border-slate-755 hover:border-slate-700/80 p-2.5 rounded-xl shadow-2xl backdrop-blur-md max-w-[280px] pointer-events-none select-none transition-all hidden md:flex items-start gap-2.5">
                    <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <div>
                        <div className="text-[10px] font-bold text-white uppercase tracking-wider">Karnataka EV Grid Map</div>
                        <div className="text-[9px] text-slate-400 leading-normal mt-0.5">
                            Select chargers to view detailed connectors power, charging schedules, and trigger live directions.
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
