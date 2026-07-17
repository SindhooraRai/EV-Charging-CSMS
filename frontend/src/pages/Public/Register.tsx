import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, User, Mail, Lock, Check, Phone, UserPlus, Eye, EyeOff } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAgreed) return;
        setIsLoading(true);
        setError(null);

        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
            const response = await fetch(`${apiBase}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errMsg = "Registration failed. Check your fields or try again.";
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        errMsg = errorData.detail
                            .map((err: any) => `${err.loc[err.loc.length - 1]}: ${err.msg}`)
                            .join(", ");
                    } else if (typeof errorData.detail === "string") {
                        errMsg = errorData.detail;
                    }
                }
                throw new Error(errMsg);
            }

            // Redirect to login page upon successful database registration
            navigate("/login", { state: { registered: true } });
        } catch (err: any) {
            setError(err.message || "Failed to connect to the registration service");
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
                <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
                    Create standard driver account
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Or{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card border border-border py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                                First & Last Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    minLength={2}
                                    maxLength={100}
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-border bg-muted/30 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                />
                            </div>
                        </div>

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
                            <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground">
                                Phone Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    minLength={10}
                                    maxLength={15}
                                    pattern="[0-9]+"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
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
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
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

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="agree"
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    required
                                    className="h-4 w-4 text-primary focus:ring-primary border-border bg-muted/30 rounded cursor-pointer"
                                />
                            </div>
                            <label htmlFor="agree" className="ml-2 block text-xs text-muted-foreground cursor-pointer select-none">
                                I agree to the VoltGrid terms of service, developer agreements, and privacy policies.
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !isAgreed}
                                className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-emerald-500/20 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-emerald-600 hover:from-[#15c587] hover:to-[#059669] shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Create Free Account</span>
                                        <UserPlus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
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
