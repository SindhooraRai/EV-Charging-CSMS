import React, { useState } from "react";
import { Search, UserPlus, Shield, Ban, Check, UserCheck } from "lucide-react";

export default function AdminUsers() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "driver@voltgrid.com", role: "Driver", status: "Active", wallet: "$42.50", rfid: "VOLT-9827-X1" },
        { id: 2, name: "Amit Sharma", email: "amit.sharma@gmail.com", role: "Driver", status: "Active", wallet: "$12.00", rfid: "VOLT-1029-A4" },
        { id: 3, name: "Sarah Connor", email: "sarah@cyberdyne.io", role: "Operator", status: "Suspended", wallet: "$0.00", rfid: "None" },
        { id: 4, name: "Tech Engineer Root", email: "support@voltgrid.com", role: "Admin", status: "Active", wallet: "$120.00", rfid: "VOLT-9999-E1" },
    ]);

    const toggleStatus = (id: number) => {
        setUsers(prev => prev.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === "Active" ? "Suspended" : "Active" };
            }
            return u;
        }));
    };

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Registered Users & Operators</h1>
                    <p className="text-muted-foreground text-sm">System accounts, login activities, and client authorization levels.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-1.5 self-start">
                    <UserPlus className="h-4 w-4" /> Provision Account
                </button>
            </div>

            <div className="border border-border bg-card rounded-2xl overflow-hidden shadow-lg">
                {/* Search Header */}
                <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap bg-muted/10">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search user email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-card w-full border border-border rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* User Database Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Access Level</th>
                                <th className="p-4">Wallet Bal.</th>
                                <th className="p-4">Paired RFID</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="p-4 font-semibold">{user.name}</td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{user.email}</td>
                                    <td className="p-4 font-semibold">{user.role}</td>
                                    <td className="p-4 font-bold">{user.wallet}</td>
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{user.rfid}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.status === "Active"
                                                ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleStatus(user.id)}
                                            className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${user.status === "Active"
                                                    ? "border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10"
                                                    : "border-emerald-500/20 text-emerald-450 bg-emerald-500/5 hover:bg-emerald-500/10"
                                                }`}
                                        >
                                            {user.status === "Active" ? "Suspend" : "Activate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
