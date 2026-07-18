import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Zap, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
            const response = await fetch(`${apiBase}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Invalid email or password");
            }

            const data = await response.json();

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("user", JSON.stringify({
                name: data.name,
                email,
                phone: data.phone,
                vehicle: data.vehicle,
                role: data.role
            }));

            if (data.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Failed to connect to the login service");
        } finally {
            setIsLoading(false);
        }
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
                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}
                {location.state?.registered && (
                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-xl text-sm text-center font-medium">
                        Account created successfully! Please sign in.
                    </div>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card border border-border py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
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
                                    placeholder="Enter your email"
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
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-border bg-muted/30 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer select-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-border bg-muted/30 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground cursor-pointer select-none">
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
                                className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-emerald-500/20 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-emerald-600 hover:from-[#15c587] hover:to-[#059669] shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
