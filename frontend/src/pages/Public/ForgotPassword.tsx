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
                                        placeholder="Enter your email"
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
                                    className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-emerald-500/20 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-emerald-600 hover:from-[#15c587] hover:to-[#059669] shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Sending link...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Send Reset Instructions</span>
                                            <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                                        </>
                                    )}
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
