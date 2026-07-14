import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Account created", { description: "Please verify your email." });
      nav({ to: "/auth/otp" });
    }, 700);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Join the fastest-growing EV charging network.</p>
      <form className="mt-6 space-y-3" onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First name" className="h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input required placeholder="Last name" className="h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <input required type="email" placeholder="Work email" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <input required placeholder="Phone number" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <input required type="password" placeholder="Password" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-border bg-surface" />
          I agree to the <a href="#" className="text-primary-glow">terms</a> and <a href="#" className="text-primary-glow">privacy policy</a>.
        </label>
        <button disabled={loading} className="w-full h-11 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-60">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered? <Link to="/auth/login" search={{ role: "user" }} className="text-primary-glow hover:underline">Sign in</Link>
      </p>
    </motion.div>
  );
}
