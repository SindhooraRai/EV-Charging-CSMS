import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    ShieldAlert,
    LayoutDashboard,
    Users,
    Compass,
    Activity,
    DollarSign,
    BarChart3,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Shield,
    Bell
} from "lucide-react";

export default function AdminLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Stations", path: "/admin/stations", icon: Compass },
        { name: "Live Sessions", path: "/admin/live", icon: Activity },
        { name: "Transactions", path: "/admin/transactions", icon: DollarSign },
        { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { name: "Alerts", path: "/admin/alerts", icon: ShieldAlert },
        { name: "System Settings", path: "/admin/settings", icon: Settings },
        { name: "Profile", path: "/admin/profile", icon: User },
    ];

    return (
        <div className="min-h-screen flex bg-background text-foreground overflow-x-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card shrink-0">
                <div className="p-6 flex items-center gap-3 border-b border-border">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-450 glow-primary">
                        <Shield className="h-5 w-5 fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-wider uppercase">VoltGrid</span>
                        <span className="text-[10px] text-emerald-450 tracking-widest font-semibold uppercase">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h2 className="font-semibold text-lg max-md:hidden">
                            {navItems.find((n) => location.pathname.startsWith(n.path))?.name || "VoltGrid Admin"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                            Systems Connected
                        </div>

                        <Link to="/admin/alerts" className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
                        </Link>

                        <Link to="/admin/profile" className="flex items-center gap-2 group">
                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 grid place-items-center text-emerald-400 text-xs font-bold">
                                AD
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors max-sm:hidden">
                                Admin User
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Dynamic page contents wrapper */}
                <main className="flex-1 p-6 overflow-y-auto max-sm:p-4">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Drawer Overlay */}
            {
                isMobileOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        {/* Drawer menu */}
                        <aside className="relative flex flex-col w-72 max-w-[80vw] bg-card border-r border-border h-full p-6 animate-slide-in">
                            <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400">
                                        <Shield className="h-4.5 w-4.5 fill-current" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm tracking-wider uppercase">VoltGrid</span>
                                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">Admin Panel</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="border-t border-border pt-4 mt-6">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </Link>
                            </div>
                        </aside>
                    </div>
                )
            }
        </div >
    );
}
