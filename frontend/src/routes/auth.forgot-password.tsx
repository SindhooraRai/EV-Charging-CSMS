import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/forgot-password")({ component: Forgot });

function Forgot() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Reset link sent", { description: "Check your inbox for instructions." });
      nav({ to: "/auth/otp" });
    }, 600);
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
      <form className="mt-6 space-y-3" onSubmit={submit}>
        <input required type="email" placeholder="you@company.com" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <button disabled={loading} className="w-full h-11 rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60">{loading ? "Sending…" : "Send reset link"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Remembered it? <Link to="/auth/login" search={{ role: "user" }} className="text-primary-glow hover:underline">Sign in</Link></p>
    </div>
  );
}
