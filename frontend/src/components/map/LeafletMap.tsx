import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Station } from "../../data/stations";
import { MapPin, Navigation, Star, Battery, X } from "lucide-react";
import { Link } from "react-router-dom";

// Import Leaflet CSS in the app
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
    stations: Station[];
    center: [number, number];
    zoom: number;
    selectedStationId: number | null;
    onSelectStation: (id: number) => void;
}

// Controller component to smoothly pan and zoom the map
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, zoom, {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.25
        });
    }, [center, zoom, map]);

    return null;
}

// Render dynamic colored marker pins based on status representation
const createCustomMarker = (status: "available" | "charging" | "offline") => {
    let pinColor = "#10b981"; // green for available
    if (status === "charging") pinColor = "#3b82f6"; // blue for charging
    if (status === "offline") pinColor = "#ef4444"; // red for offline

    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                  fill="${pinColor}" stroke="#ffffff" stroke-width="1.8" />
        </svg>
    `;

    return L.divIcon({
        html: svgIcon,
        className: "custom-ev-marker",
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32]
    });
};

export default function LeafletMap({
    stations,
    center,
    zoom,
    selectedStationId,
    onSelectStation
}: LeafletMapProps) {
    return (
        <div className="w-full h-full rounded-2xl border border-card-border overflow-hidden relative shadow-lg">
            {/* The leaflet styles in dark theme: we invert tile color via CSS to prevent light map blindness */}
            <style>{`
                .leaflet-container {
                    background: #0f172a !important;
                }
                /* Exquisite styling to turn vanilla openstreetmap tiles into premium dark mode tiles */
                .dark-leaflet-tiles {
                    filter: invert(90%) hue-rotate(200deg) brightness(85%) contrast(90%) !important;
                }
                .leaflet-popup-content-wrapper {
                    background-color: #1e293b !important;
                    color: #f8fafc !important;
                    border: 1px solid #334155 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
                    padding: 0px !important;
                }
                .leaflet-popup-tip {
                    background-color: #1e293b !important;
                    border: 1px solid #334155 !important;
                }
                .leaflet-popup-close-button {
                    color: #94a3b8 !important;
                    margin-top: 6px !important;
                    margin-right: 6px !important;
                }
                .leaflet-popup-close-button:hover {
                    color: #f8fafc !important;
                }
            `}</style>

            <MapContainer
                center={center}
                zoom={zoom}
                className="w-full h-full z-10"
                zoomControl={true}
                attributionControl={false}
            >
                <MapController center={center} zoom={zoom} />

                {/* Free dynamic OpenStreetMap tiles configured with CSS dark filter classes */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="dark-leaflet-tiles"
                />

                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.lat, station.lng]}
                        icon={createCustomMarker(station.status)}
                        eventHandlers={{
                            click: () => onSelectStation(station.id)
                        }}
                    >
                        <Popup maxWidth={260} closeButton={true}>
                            <div className="p-3 font-sans space-y-3">
                                <div>
                                    <h4 className="font-bold text-sm tracking-tight text-white hover:text-primary transition-all">
                                        {station.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-start gap-1">
                                        <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-slate-500" />
                                        <span>{station.address}</span>
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/50">
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${station.status === "available"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : station.status === "charging"
                                                    ? "bg-blue-500/10 text-blue-400"
                                                    : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {station.status}
                                        </span>
                                        <span className="text-[10px] text-slate-300 font-semibold">
                                            ₹{station.pricePerKwh}/kWh
                                        </span>
                                    </div>
                                    <div className="flex items-center text-[10px] text-yellow-500 font-bold gap-0.5">
                                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                                        <span>{station.rating}</span>
                                    </div>
                                </div>

                                <div className="space-y-1 bg-slate-900/40 p-2 rounded-lg border border-slate-750">
                                    <div className="text-[10px] uppercase font-bold text-slate-400">Available units</div>
                                    <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-200">
                                        <Battery className="h-3.5 w-3.5 text-primary" />
                                        <span>{station.availableChargers} of {station.totalChargers} Chargers Available</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate mt-1">
                                        Ports: {station.connectors.map(c => `${c.count}x ${c.type.split(" ")[0]}`).join(", ")}
                                    </div>
                                </div>

                                <Link
                                    to={`/user/stations/${station.id}`}
                                    className="block text-center py-1.5 bg-primary text-primary-foreground hover:opacity-95 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm shadow-primary/20"
                                >
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
