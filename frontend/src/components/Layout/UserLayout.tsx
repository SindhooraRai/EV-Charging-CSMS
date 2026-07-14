import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    MapPin,
    BatteryCharging,
    History,
    CreditCard,
    Bell,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Zap
} from "lucide-react";

export default function UserLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
        { name: "Nearby Chargers", path: "/user/nearby", icon: MapPin },
        { name: "Live Charging", path: "/user/live", icon: BatteryCharging },
        { name: "RFID Card", path: "/user/rfid", icon: CreditCard },
        { name: "Charging History", path: "/user/history", icon: History },
        { name: "Notifications", path: "/user/notifications", icon: Bell },
        { name: "Profile", path: "/user/profile", icon: User },
        { name: "Settings", path: "/user/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-background text-foreground overflow-x-hidden">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card shrink-0">
                <div className="p-6 flex items-center gap-3 border-b border-border">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center text-primary glow-primary">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                    <span className="font-bold text-xl tracking-wider uppercase font-[family-name:var(--font-display)]">VoltGrid</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== "/user/dashboard" && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary/10 text-primary glow-primary"
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
                            {navItems.find((n) => location.pathname.startsWith(n.path))?.name || "VoltGrid"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Quick status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Wallet Bal: $42.50
                        </div>

                        {/* Quick Notification Bell */}
                        <Link to="/user/notifications" className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary glow-primary"></span>
                        </Link>

                        <Link to="/user/profile" className="flex items-center gap-2 group">
                            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/45 grid place-items-center text-primary text-xs font-bold font-[family-name:var(--font-display)]">
                                JD
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors max-sm:hidden">
                                John Doe
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
            {isMobileOpen && (
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
                                <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center text-primary">
                                    <Zap className="h-4.5 w-4.5 fill-current" />
                                </div>
                                <span className="font-bold tracking-wider uppercase">VoltGrid</span>
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
                                const isActive = location.pathname === item.path || (item.path !== "/user/dashboard" && location.pathname.startsWith(item.path));
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-primary/10 text-primary glow-primary"
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
            )}
        </div>
    );
}
