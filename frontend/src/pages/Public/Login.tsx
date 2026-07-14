import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent, role?: "user" | "admin") => {
        e.preventDefault();
        setIsLoading(true);

        // Simulating API latency
        setTimeout(() => {
            setIsLoading(false);
            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center text-primary glow-primary">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                    <span className="font-bold text-2xl tracking-wider uppercase">VoltGrid</span>
                </Link>
                <h2 className="text-center text-3xl font-extrabold tracking-tight">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Or{" "}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        create a new network account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card border border-border py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={(e) => handleLogin(e, "user")}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="driver@voltgrid.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-border bg-muted/30 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-border bg-muted/30 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-border bg-muted/30 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 glow-primary"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </div>
                    </form>

                    {/* Quick Sandbox Login Buttons */}
                    <div className="mt-8 border-t border-border pt-6">
                        <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-4">
                            Demo Gateways
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={(e) => handleLogin(e, "user")}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border bg-muted/20 hover:bg-muted/50 rounded-xl text-sm font-semibold transition-all hover:border-primary/40 group"
                            >
                                Driver Portal
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={(e) => handleLogin(e, "admin")}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-border bg-emerald-500/10 text-emerald-450 hover:bg-emerald-500/20 rounded-xl text-sm font-semibold transition-all hover:border-emerald-500/40 group"
                            >
                                Admin Panel
                                <ArrowRight className="h-3.5 w-3.5 text-emerald-550 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
