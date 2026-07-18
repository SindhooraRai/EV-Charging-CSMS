import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import type { Station } from "../../data/stations";
import { MapPin, Navigation, Star, Battery, X } from "lucide-react";
import { Link } from "react-router-dom";

// Import Leaflet CSS and Routing Machine styles
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface LeafletMapProps {
    stations: Station[];
    center: [number, number];
    zoom: number;
    selectedStationId: number | null;
    onSelectStation: (id: number) => void;
    userLocation?: [number, number] | null;
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

// Sub-component to manage Leaflet Routing Machine overlay
interface RoutingOverlayProps {
    userLocation: [number, number];
    destinationCoords: [number, number];
    onRouteInfo: (info: { distance: string; duration: string } | null) => void;
}

function RoutingOverlay({ userLocation, destinationCoords, onRouteInfo }: RoutingOverlayProps) {
    const map = useMap();
    const routingControlRef = useRef<any>(null);

    useEffect(() => {
        if (!map || !userLocation || !destinationCoords) return;

        // Create routing control using Leaflet Routing Machine / OSRM
        const control = (L as any).Routing.control({
            waypoints: [
                L.latLng(userLocation[0], userLocation[1]),
                L.latLng(destinationCoords[0], destinationCoords[1])
            ],
            router: (L as any).Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1"
            }),
            lineOptions: {
                styles: [{ color: "#a855f7", weight: 6, opacity: 0.85 }] // violet route path to match our theme!
            },
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false, // hide default turn-by-turn text box
            createMarker: () => null // don't draw extra default markers (we keep our own)
        });

        control.on("routesfound", (e: any) => {
            const routes = e.routes;
            if (routes && routes.length > 0) {
                const summary = routes[0].summary;
                const distanceKm = (summary.totalDistance / 1000).toFixed(1);
                const durationSec = summary.totalTime;

                let timeString = "";
                if (durationSec > 3600) {
                    const hrs = Math.floor(durationSec / 3600);
                    const mins = Math.round((durationSec % 3600) / 60);
                    timeString = `${hrs} hr ${mins} min`;
                } else {
                    const mins = Math.round(durationSec / 60);
                    timeString = `${mins} min`;
                }

                onRouteInfo({
                    distance: `${distanceKm} km`,
                    duration: timeString
                });

                // Adjust bounds to fit both points perfectly with nice padding
                const bounds = L.latLngBounds([userLocation, destinationCoords]);
                map.fitBounds(bounds, { padding: [80, 80] });
            }
        });

        control.on("routingerror", (err: any) => {
            console.error("Routing error:", err);
            onRouteInfo(null);
        });

        control.addTo(map);
        routingControlRef.current = control;

        return () => {
            if (routingControlRef.current && map) {
                try {
                    map.removeControl(routingControlRef.current);
                } catch (e) {
                    console.warn("Error removing routing control:", e);
                }
            }
            onRouteInfo(null);
        };
    }, [map, userLocation, destinationCoords]);

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

// Create a custom 📍 emoji marker for user location
const createUserLocationMarker = () => {
    const htmlIcon = `
        <div style="font-size: 28px; line-height: 1; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.45)); user-select: none;">
            📍
            <style>
                .custom-user-marker { background: none !important; border: none !important; }
            </style>
        </div>
    `;

    return L.divIcon({
        html: htmlIcon,
        className: "custom-user-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
};

export default function LeafletMap({
    stations,
    center,
    zoom,
    selectedStationId,
    onSelectStation,
    userLocation: propUserLocation
}: LeafletMapProps) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(propUserLocation || null);
    const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>(center);
    const [mapZoom, setMapZoom] = useState<number>(zoom);
    const [showLocationDenied, setShowLocationDenied] = useState<boolean>(false);

    const prevCenterRef = useRef<[number, number]>(center);

    // Sync state only when props actually change by value
    useEffect(() => {
        if (center[0] !== prevCenterRef.current[0] || center[1] !== prevCenterRef.current[1]) {
            setMapCenter(center);
            setMapZoom(zoom);
            prevCenterRef.current = center;
        }
    }, [center, zoom]);

    // Sync user location from parent prop if provided
    useEffect(() => {
        if (propUserLocation) {
            setUserLocation(propUserLocation);
            setMapCenter(propUserLocation);
            setMapZoom(13);
            setShowLocationDenied(false);
        }
    }, [propUserLocation]);

    // Request user coordinates on load/click
    const requestUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation([lat, lng]);
                    setMapCenter([lat, lng]);
                    setMapZoom(13);
                    setShowLocationDenied(false);
                },
                (error) => {
                    console.log("Permission denied or location retrieval failed:", error);
                    setShowLocationDenied(true);
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            setShowLocationDenied(true);
        }
    };

    useEffect(() => {
        requestUserLocation();
    }, []);

    // Set destination and request location if not available
    const handleNavigate = (lat: number, lng: number) => {
        if (!userLocation) {
            setShowLocationDenied(false);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        setUserLocation([userLat, userLng]);
                        setDestinationCoords([lat, lng]);
                    },
                    (error) => {
                        console.error("Location access denied on navigation trigger:", error);
                        setShowLocationDenied(true);
                    },
                    { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
                );
            } else {
                setShowLocationDenied(true);
            }
            return;
        }
        setDestinationCoords([lat, lng]);
    };

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-card-border bg-slate-950/20 backdrop-blur-sm">
            {/* Action Alert Banner for Location Permission Warning */}
            {showLocationDenied && (
                <div className="absolute top-4 left-4 right-4 z-[1000] bg-red-950/90 border border-red-500/30 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2.5">
                        <X className="h-5 w-5 text-red-400 shrink-0" />
                        <span className="text-xs font-semibold text-red-200">
                            Location permission is required for navigation. Please enable location access in your browser.
                        </span>
                    </div>
                    <button
                        onClick={() => setShowLocationDenied(false)}
                        className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-lg transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Floating Navigation Info & Clear Route overlay */}
            {destinationCoords && routeInfo && (
                <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 border border-slate-750 p-4 rounded-xl shadow-2xl backdrop-blur-md w-64 flex flex-col gap-2.5 text-white pointer-events-auto select-none transition-all">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Route Navigation</span>
                        <button
                            onClick={() => {
                                setDestinationCoords(null);
                                setRouteInfo(null);
                            }}
                            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 p-1 rounded-lg transition-all cursor-pointer"
                            title="Clear Route"
                        >
                            <X className="h-4.5 w-4.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-0.5">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Distance</span>
                            <span className="text-base font-bold text-primary font-mono">{routeInfo.distance}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Est. Time</span>
                            <span className="text-base font-bold text-cyan-400 font-mono">{routeInfo.duration}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setDestinationCoords(null);
                            setRouteInfo(null);
                        }}
                        className="w-full py-1.5 mt-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 hover:border-red-500/35 text-red-400 hover:text-red-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                        <X className="h-3.5 w-3.5" />
                        Clear Route
                    </button>
                </div>
            )}

            {/* Floating "Locate Me" button */}
            <button
                onClick={requestUserLocation}
                className="absolute bottom-4 right-4 z-[1000] p-3 text-white bg-slate-900/90 border border-slate-750 hover:border-slate-600/80 rounded-xl hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-lg flex items-center justify-center"
                title="Locate Me"
            >
                <Navigation className="h-5 w-5" />
            </button>

            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className="w-full h-full z-10"
                zoomControl={true}
                attributionControl={false}
            >
                <MapController center={mapCenter} zoom={mapZoom} />

                {/* Free dynamic OpenStreetMap tiles configured with CSS dark filter classes */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="dark-leaflet-tiles"
                />

                {/* User Current Live Location Marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={createUserLocationMarker()}>
                        <Tooltip direction="top" offset={[0, -20]} opacity={0.9} permanent={false}>
                            📍 You are here
                        </Tooltip>
                    </Marker>
                )}

                {/* Routing Overlay for navigation directions */}
                {userLocation && destinationCoords && (
                    <RoutingOverlay
                        userLocation={userLocation}
                        destinationCoords={destinationCoords}
                        onRouteInfo={setRouteInfo}
                    />
                )}

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

                                <div className="flex flex-col gap-2">
                                    <Link
                                        to={`/user/stations/${station.id}`}
                                        className="block text-center py-1.5 bg-primary text-primary-foreground hover:opacity-95 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm shadow-primary/20"
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        onClick={() => handleNavigate(station.lat, station.lng)}
                                        className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                                    >
                                        <Navigation className="h-3.5 w-3.5" />
                                        Navigate
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
