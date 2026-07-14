import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth, type Role } from "@/store/auth";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    role: (s.role as Role) || "user",
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { role } = Route.useSearch();
  const login = useAuth((s) => s.loginAs);
  const [email, setEmail] = useState("aarav@voltgrid.io");
  const [pw, setPw] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Role>(role);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(tab, email);
      toast.success("Signed in", { description: `Welcome back to VoltGrid.` });
      const to = tab === "admin" ? "/admin/dashboard" : "/app/dashboard";
      nav({ to });
    }, 700);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface p-1 text-xs">
        {(["user", "admin"] as Role[]).map((r) => (
          <button key={r}
            onClick={() => setTab(r)}
            className={`rounded-md py-1.5 capitalize ${tab === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email"
            className="mt-1 w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Password</label>
            <Link to="/auth/forgot-password" className="text-xs text-primary-glow hover:underline">Forgot?</Link>
          </div>
          <input value={pw} onChange={(e) => setPw(e.target.value)} required type="password"
            className="mt-1 w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <button disabled={loading} className="w-full h-11 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account? <Link to="/auth/register" className="text-primary-glow hover:underline">Create one</Link>
      </p>
    </motion.div>
  );
}
