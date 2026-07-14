// Deterministic mock data for demos.

export type Station = {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: "online" | "charging" | "fault" | "offline";
  connectors: number;
  power: number; // kW
  price: number; // ₹/kWh
  utilization: number; // %
  revenue: number; // ₹
};

export const stations: Station[] = [
  { id: "STN-001", name: "Whitefield Hub", city: "Bengaluru", address: "ITPL Main Road", lat: 12.9698, lng: 77.7500, status: "charging", connectors: 8, power: 150, price: 18, utilization: 82, revenue: 184320 },
  { id: "STN-002", name: "MG Road Superhub", city: "Bengaluru", address: "MG Road, Ashok Nagar", lat: 12.9750, lng: 77.6060, status: "online", connectors: 12, power: 250, price: 22, utilization: 74, revenue: 231800 },
  { id: "STN-003", name: "Cyber City Point", city: "Gurgaon", address: "DLF Cyber City", lat: 28.4949, lng: 77.0891, status: "charging", connectors: 6, power: 120, price: 20, utilization: 68, revenue: 152430 },
  { id: "STN-004", name: "BKC Tower", city: "Mumbai", address: "Bandra Kurla Complex", lat: 19.0662, lng: 72.8687, status: "fault", connectors: 10, power: 180, price: 21, utilization: 34, revenue: 91240 },
  { id: "STN-005", name: "Anna Nagar Plaza", city: "Chennai", address: "2nd Ave, Anna Nagar", lat: 13.0850, lng: 80.2101, status: "online", connectors: 4, power: 60, price: 16, utilization: 51, revenue: 63120 },
  { id: "STN-006", name: "Salt Lake Sector V", city: "Kolkata", address: "Sector V, Salt Lake", lat: 22.5726, lng: 88.4291, status: "offline", connectors: 6, power: 90, price: 17, utilization: 0, revenue: 0 },
  { id: "STN-007", name: "HITEC Grid", city: "Hyderabad", address: "HITEC City", lat: 17.4474, lng: 78.3762, status: "charging", connectors: 10, power: 200, price: 19, utilization: 79, revenue: 198470 },
  { id: "STN-008", name: "Koregaon Park", city: "Pune", address: "North Main Road", lat: 18.5362, lng: 73.8939, status: "online", connectors: 4, power: 90, price: 18, utilization: 45, revenue: 58230 },
];

export const revenueSeries = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  revenue: Math.round(60000 + Math.sin(i / 3) * 22000 + Math.random() * 15000),
  energy: Math.round(4200 + Math.sin(i / 2) * 900 + Math.random() * 400),
  sessions: Math.round(180 + Math.sin(i / 4) * 60 + Math.random() * 30),
}));

export const hourlyUsage = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  kwh: Math.round(30 + Math.sin((h - 6) / 3) * 25 + Math.random() * 10 + (h > 8 && h < 22 ? 40 : 5)),
}));

export const connectorMix = [
  { name: "CCS2", value: 46 },
  { name: "CHAdeMO", value: 12 },
  { name: "Type-2", value: 28 },
  { name: "GB/T", value: 14 },
];

export type Session = {
  id: string;
  station: string;
  user: string;
  vehicle: string;
  start: string;
  duration: string;
  energy: number;
  cost: number;
  status: "active" | "completed" | "failed";
};

export const sessions: Session[] = [
  { id: "SES-9821", station: "Whitefield Hub", user: "Aarav Sharma", vehicle: "Tata Nexon EV", start: "10:24", duration: "38m", energy: 28.4, cost: 511, status: "active" },
  { id: "SES-9820", station: "MG Road Superhub", user: "Diya Kapoor", vehicle: "MG ZS EV", start: "10:12", duration: "1h 06m", energy: 42.1, cost: 926, status: "completed" },
  { id: "SES-9819", station: "HITEC Grid", user: "Rohan Iyer", vehicle: "Hyundai Kona", start: "09:48", duration: "52m", energy: 33.7, cost: 640, status: "completed" },
  { id: "SES-9818", station: "Cyber City Point", user: "Sana Ali", vehicle: "BYD Atto 3", start: "09:32", duration: "44m", energy: 30.2, cost: 604, status: "completed" },
  { id: "SES-9817", station: "BKC Tower", user: "Vikram Rao", vehicle: "Kia EV6", start: "09:12", duration: "12m", energy: 6.2, cost: 130, status: "failed" },
  { id: "SES-9816", station: "Anna Nagar Plaza", user: "Priya Menon", vehicle: "Tata Tigor EV", start: "08:58", duration: "1h 22m", energy: 24.9, cost: 398, status: "completed" },
];

export type Transaction = {
  id: string;
  user: string;
  station: string;
  method: "UPI" | "Card" | "Wallet" | "NetBanking";
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
};

export const transactions: Transaction[] = [
  { id: "TXN-30112", user: "Aarav Sharma", station: "Whitefield Hub", method: "UPI", amount: 511, status: "success", date: "Today, 10:24" },
  { id: "TXN-30111", user: "Diya Kapoor", station: "MG Road Superhub", method: "Card", amount: 926, status: "success", date: "Today, 09:52" },
  { id: "TXN-30110", user: "Rohan Iyer", station: "HITEC Grid", method: "Wallet", amount: 640, status: "success", date: "Today, 09:38" },
  { id: "TXN-30109", user: "Sana Ali", station: "Cyber City Point", method: "UPI", amount: 604, status: "pending", date: "Today, 09:18" },
  { id: "TXN-30108", user: "Vikram Rao", station: "BKC Tower", method: "Card", amount: 130, status: "failed", date: "Today, 09:02" },
  { id: "TXN-30107", user: "Priya Menon", station: "Anna Nagar Plaza", method: "NetBanking", amount: 398, status: "success", date: "Yesterday" },
  { id: "TXN-30106", user: "Anish Verma", station: "Salt Lake Sector V", method: "UPI", amount: 240, status: "success", date: "Yesterday" },
];

export type Notification = {
  id: string;
  type: "charging" | "payment" | "system" | "fault";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export const notifications: Notification[] = [
  { id: "N1", type: "charging", title: "Charging complete", body: "Session SES-9820 finished at MG Road Superhub — 42.1 kWh.", time: "5m ago", read: false },
  { id: "N2", type: "payment", title: "Payment received", body: "₹926 credited via UPI for TXN-30111.", time: "8m ago", read: false },
  { id: "N3", type: "fault", title: "Connector fault", body: "BKC Tower connector C-04 reported OverCurrent.", time: "42m ago", read: false },
  { id: "N4", type: "system", title: "Firmware rollout", body: "OCPP 1.6 → 2.0.1 completed on 24 stations.", time: "2h ago", read: true },
  { id: "N5", type: "charging", title: "Session started", body: "Aarav started charging at Whitefield Hub.", time: "3h ago", read: true },
];

export type FaultAlert = {
  id: string;
  station: string;
  code: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  time: string;
};

export const alerts: FaultAlert[] = [
  { id: "A-2201", station: "BKC Tower", code: "E-OC-04", severity: "critical", message: "Over-current on connector C-04", time: "42m ago" },
  { id: "A-2200", station: "Salt Lake Sector V", code: "E-OFF-02", severity: "high", message: "Station offline > 20 min", time: "1h ago" },
  { id: "A-2199", station: "Cyber City Point", code: "W-TMP", severity: "medium", message: "Cabinet temp 62°C", time: "3h ago" },
  { id: "A-2198", station: "Anna Nagar Plaza", code: "I-HB", severity: "low", message: "Heartbeat jitter 12s", time: "5h ago" },
];

export type RFID = { id: string; label: string; balance: number; active: boolean };
export const rfidCards: RFID[] = [
  { id: "RF-8821", label: "Personal", balance: 1240, active: true },
  { id: "RF-8822", label: "Office fleet", balance: 8600, active: true },
  { id: "RF-8823", label: "Backup", balance: 0, active: false },
];

export type Operator = { id: string; name: string; region: string; stations: number; revenue: number; status: "active" | "suspended" };
export const operators: Operator[] = [
  { id: "OP-01", name: "GreenVolt Networks", region: "South", stations: 128, revenue: 12480000, status: "active" },
  { id: "OP-02", name: "PowerPath India", region: "West", stations: 96, revenue: 9420000, status: "active" },
  { id: "OP-03", name: "NextCharge Grid", region: "North", stations: 74, revenue: 6810000, status: "active" },
  { id: "OP-04", name: "EcoPlug Systems", region: "East", stations: 38, revenue: 3120000, status: "suspended" },
];

export const platformUsers = [
  { id: "U-10021", name: "Aarav Sharma", email: "aarav@voltgrid.io", sessions: 42, spent: 12480, joined: "Aug 12, 2024" },
  { id: "U-10022", name: "Diya Kapoor", email: "diya@example.com", sessions: 31, spent: 9210, joined: "Sep 02, 2024" },
  { id: "U-10023", name: "Rohan Iyer", email: "rohan@example.com", sessions: 58, spent: 21430, joined: "Jun 18, 2024" },
  { id: "U-10024", name: "Sana Ali", email: "sana@example.com", sessions: 22, spent: 5320, joined: "Nov 03, 2024" },
  { id: "U-10025", name: "Vikram Rao", email: "vikram@example.com", sessions: 12, spent: 2980, joined: "Feb 09, 2025" },
];

export const testimonials = [
  { name: "Kabir Malhotra", role: "COO, GreenVolt Networks", quote: "VoltGrid gave our operations team live visibility across 128 stations. Fault triage dropped from hours to minutes." },
  { name: "Ananya Desai", role: "Director, PowerPath India", quote: "Revenue analytics and dynamic pricing paid for the platform in the first quarter." },
  { name: "Rahul Menon", role: "CTO, NextCharge Grid", quote: "Best OCPP compliance we've seen. Rolling out firmware to 74 stations was a single click." },
];

export const faq = [
  { q: "Do you support OCPP 1.6 and 2.0.1?", a: "Yes. VoltGrid ships with a hardened OCPP 1.6-J and 2.0.1 stack and passes the OCA compliance suite." },
  { q: "Which payment methods are supported?", a: "UPI, credit and debit cards, net banking, RFID, and prepaid wallets are all supported out of the box." },
  { q: "Can I white-label the driver app?", a: "Yes. The user portal and mobile app can be themed to match your brand identity." },
  { q: "How is uptime measured?", a: "We track heartbeat, connector-level availability, and OCPP round-trip latency. SLAs are computed per-station and per-connector." },
  { q: "Is there an API?", a: "Yes. A REST + WebSocket API is available for CRM, ERP, and fleet management integrations." },
];
