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
    }
];
