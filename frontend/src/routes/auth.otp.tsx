import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/otp")({ component: OTP });

function OTP() {
  const nav = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const complete = digits.every((d) => d.length === 1);

  const set = (i: number, v: string) => {
    const next = [...digits];
    next[i] = v.slice(-1).replace(/\D/, "");
    setDigits(next);
    if (next[i] && i < 5) refs.current[i + 1]?.focus();
  };
  const submit = () => {
    toast.success("Verified", { description: "Your account is ready." });
    nav({ to: "/app/dashboard" });
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold">Enter verification code</h1>
      <p className="mt-1 text-sm text-muted-foreground">We sent a 6-digit code to your email.</p>
      <div className="mt-6 flex justify-between gap-2">
        {digits.map((d, i) => (
          <input key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={d}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
            inputMode="numeric"
            className="h-14 w-full max-w-[52px] rounded-lg border border-border bg-surface text-center text-lg font-semibold stat focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        ))}
      </div>
      <button disabled={!complete} onClick={submit} className="mt-6 w-full h-11 rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:opacity-50">Verify</button>
      <p className="mt-4 text-center text-xs text-muted-foreground">Didn't get it? <button className="text-primary-glow hover:underline">Resend</button></p>
    </div>
  );
}
