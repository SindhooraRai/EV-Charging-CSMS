import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 1000);
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
                    Forgot your password?
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your credentials.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-card border border-border py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
                    {!isSent ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                        placeholder="driver@voltgrid.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-border bg-muted/30 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 glow-primary"
                                >
                                    {isLoading ? "Sending link..." : "Send Reset Instructions"}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                    <ArrowLeft className="h-4 w-4" />
                                    Get back to sign-in
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-4 space-y-4">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 grid place-items-center mx-auto">
                                <Send className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold">Email dispatched!</h3>
                            <p className="text-sm text-muted-foreground">
                                We've sent reset instructions to <strong>{email}</strong>. Please check your spam inbox if you don't receive it shortly.
                            </p>
                            <div className="pt-2">
                                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login page
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
