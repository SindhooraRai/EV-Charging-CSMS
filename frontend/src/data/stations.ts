export interface ConnectorType {
    type: string;
    power: string; // e.g., "150 kW", "22 kW"
    count: number;
}

export interface Station {
    id: number;
    name: string;
    city: string;
    address: string;
    status: "available" | "charging" | "offline";
    pricePerKwh: number; // in INR e.g., 15
    connectors: ConnectorType[];
    availableChargers: number;
    totalChargers: number;
    rating: number;
    lat: number;
    lng: number;
    lastUpdated: string;
}

export const mockStations: Station[] = [
    {
        id: 1,
        name: "Mangaluru Port Ultra-Fast Hub",
        city: "Mangaluru",
        address: "Muzrai Temple Rd, Hampankatta, Mangaluru, Karnataka 575001",
        status: "available",
        pricePerKwh: 18.0,
        connectors: [
            { type: "CCS2 (DC Ultra)", power: "240 kW", count: 2 },
            { type: "Type 2 (AC)", power: "22 kW", count: 4 }
        ],
        availableChargers: 5,
        totalChargers: 6,
        rating: 4.9,
        lat: 12.9141,
        lng: 74.8560,
        lastUpdated: "12 mins ago"
    },
    {
        id: 2,
        name: "Udupi Temple Charger Hub",
        city: "Udupi",
        address: "Car Street, Beside Sri Krishna Temple, Udupi, Karnataka 576101",
        status: "offline",
        pricePerKwh: 12.5,
        connectors: [
            { type: "Type 2 (AC)", power: "7.4 kW", count: 2 }
        ],
        availableChargers: 0,
        totalChargers: 2,
        rating: 4.2,
        lat: 13.3409,
        lng: 74.7421,
        lastUpdated: "Offline - System Maintenance"
    },
    {
        id: 3,
        name: "NMAM Institute of Technology (Nitte)",
        city: "Nitte (Udupi Region)",
        address: "Nitte, Karkala Taluk, Udupi District, Karnataka 574110",
        status: "available",
        pricePerKwh: 15.0,
        connectors: [
            { type: "CCS2 (DC Fast)", power: "50 kW", count: 2 },
            { type: "Type 2 (AC)", power: "22 kW", count: 1 }
        ],
        availableChargers: 2,
        totalChargers: 3,
        rating: 4.7,
        lat: 13.1857,
        lng: 74.9348,
        lastUpdated: "10 mins ago"
    },
    {
        id: 4,
        name: "Surathkal Beach Charging Hub",
        city: "Surathkal",
        address: "Near NITK Beach, Surathkal, Karnataka 575025",
        status: "available",
        pricePerKwh: 14.0,
        connectors: [
            { type: "CCS2 (DC Fast)", power: "120 kW", count: 2 },
            { type: "Type 2 (AC)", power: "22 kW", count: 2 }
        ],
        availableChargers: 3,
        totalChargers: 4,
        rating: 4.8,
        lat: 13.0108,
        lng: 74.7943,
        lastUpdated: "5 mins ago"
    },
    {
        id: 5,
        name: "Manipal Campus Power Hub",
        city: "Manipal",
        address: "Tiger Circle, near MIT Campus, Manipal, Karnataka 576104",
        status: "charging",
        pricePerKwh: 16.5,
        connectors: [
            { type: "CCS2 (DC Ultra)", power: "150 kW", count: 1 },
            { type: "Type 2 (AC)", power: "11 kW", count: 2 }
        ],
        availableChargers: 1,
        totalChargers: 3,
        rating: 4.6,
        lat: 13.3516,
        lng: 74.7872,
        lastUpdated: "Just now"
    },
    {
        id: 6,
        name: "Kundapura National Highway Station",
        city: "Kundapura",
        address: "NH 66 Route, Kundapura, Karnataka 576201",
        status: "available",
        pricePerKwh: 13.0,
        connectors: [
            { type: "CCS2 (DC Fast)", power: "60 kW", count: 2 }
        ],
        availableChargers: 2,
        totalChargers: 2,
        rating: 4.4,
        lat: 13.6268,
        lng: 74.6934,
        lastUpdated: "18 mins ago"
    },
    {
        id: 7,
        name: "Karkala Town Charging Point",
        city: "Karkala",
        address: "Market Road, Karkala, Karnataka 574104",
        status: "available",
        pricePerKwh: 15.0,
        connectors: [
            { type: "Type 2 (AC)", power: "22 kW", count: 2 }
        ],
        availableChargers: 2,
        totalChargers: 2,
        rating: 4.3,
        lat: 13.2172,
        lng: 74.9961,
        lastUpdated: "3 mins ago"
    }
];
