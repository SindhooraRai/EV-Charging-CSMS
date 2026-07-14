import React from "react";
import { Link } from "react-router-dom";
import { Zap, HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 text-center font-sans">
            <div className="space-y-6 max-w-md">
                <div className="h-16 w-16 bg-destructive/10 border border-destructive/25 text-destructive rounded-full grid place-items-center mx-auto text-3xl animate-bounce">
                    <HelpCircle className="h-8 w-8" />
                </div>

                <h1 className="text-6xl font-extrabold tracking-widest text-muted-foreground select-none">404</h1>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Lost on VoltGrid?</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The page you are trying to visit might have been archived, restyled, or deleted completely.
                    </p>
                </div>

                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all glow-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}
