import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/reset-password")({ component: Reset });

function Reset() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Password reset", { description: "You can now sign in with your new password." });
      nav({ to: "/auth/login", search: { role: "user" } });
    }, 600);
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">Make it strong — at least 8 characters.</p>
      <form className="mt-6 space-y-3" onSubmit={submit}>
        <input required type="password" placeholder="New password" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <input required type="password" placeholder="Confirm password" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        <button disabled={loading} className="w-full h-11 rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-60">{loading ? "Saving…" : "Reset password"}</button>
      </form>
    </div>
  );
}
