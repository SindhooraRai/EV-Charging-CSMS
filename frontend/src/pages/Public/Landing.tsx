import React from "react";
import { Link } from "react-router-dom";
import { Zap, Play, CheckCircle, Shield, BarChart3, Compass } from "lucide-react";

export default function Landing() {
    const stats = [
        { label: "Active Chargers", value: "1,248" },
        { label: "Energy Delivered", value: "4.8 GWh" },
        { label: "CO2 Offset", value: "3,120 tons" },
        { label: "Platform Uptime", value: "99.98%" }
    ];

    const features = [
        {
            title: "Real-time Telemetry",
            description: "Monitor charging rates, temperature, voltage, and session telemetry on the live grid.",
            icon: Zap
        },
        {
            title: "Advanced Revenue Analytics",
            description: "Analyze grid revenue, utility charges, payment conversions, and tariff yield optimizations.",
            icon: BarChart3
        },
        {
            title: "Smart Driver App Integration",
            description: "Empower drivers with live station maps, reserve capacities, customized billing, and RFID cards.",
            icon: Compass
        },
        {
            title: "Enterprise Grade Security",
            description: "End-to-end encryption, role-based access controls, audit logging, and hardware compliance.",
            icon: Shield
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans select-none overflow-x-hidden">
            {/* Navigation */}
            <header className="h-20 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 md:px-16">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center text-primary glow-primary">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                    <span className="font-bold text-xl tracking-wider uppercase">VoltGrid</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all glow-primary">
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex-1 max-w-7xl mx-auto px-8 md:px-16 py-20 flex flex-col items-center text-center justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary glow-primary animate-pulse"></span>
                    Next-Gen Charging Management
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
                    Supercharge your EV infrastructure with <span className="gradient-text">VoltGrid</span>
                </h1>

                <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    The ultimate Cloud CSMS. Real-time telemetry, automated driver Billing, intelligent load balancing, and smart RFID management — all in one platform.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Link to="/register" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:scale-105 transition-all glow-primary flex items-center gap-2">
                        Register Network
                        <Play className="h-4 w-4 fill-current" />
                    </Link>
                    <Link to="/login" className="px-8 py-4 rounded-xl border border-border bg-card/40 hover:bg-card/90 transition-all font-semibold">
                        Demo Portal
                    </Link>
                </div>

                {/* Stats banner */}
                <div className="mt-20 w-full grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border border-border bg-card/30 rounded-2xl">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat.value}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 border-t border-border bg-card/10">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight">Built for modern operators and scale</h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            Designed from the ground up to support high-throughput transactions, low-latency station callbacks, and seamless billing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="p-6 border border-border bg-card rounded-2xl flex gap-4 hover:border-primary/30 transition-all">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 shrink-0 grid place-items-center text-primary glow-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} VoltGrid. All rights reserved.</p>
            </footer>
        </div >
    );
}
