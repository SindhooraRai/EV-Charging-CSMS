import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CreditCard, Landmark, Smartphone, Wallet, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/app/payments")({
  head: () => ({ meta: [{ title: "Payment · VoltGrid" }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const [method, setMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  const pay = () => {
    setStatus("processing");
    setTimeout(() => {
      const ok = Math.random() > 0.15;
      setStatus(ok ? "success" : "failed");
      if (ok) toast.success("Payment successful", { description: "₹511 debited via " + method.toUpperCase() });
      else toast.error("Payment failed", { description: "Please retry with another method." });
    }, 1400);
  };

  const items = [
    { label: "Energy used", value: "28.4 kWh" },
    { label: "Price per kWh", value: "₹18" },
    { label: "Subtotal", value: "₹511.20" },
    { label: "GST (18%)", value: "₹92.02" },
  ];

  return (
    <div>
      <PageHeader title="Payment" subtitle="Session SES-9821 · Whitefield Hub" />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Payment methods */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-semibold mb-4">Choose payment method</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                { key: "upi", label: "UPI", icon: Smartphone },
                { key: "card", label: "Card", icon: CreditCard },
                { key: "netbanking", label: "Net banking", icon: Landmark },
                { key: "wallet", label: "Wallet", icon: Wallet },
              ] as const).map((m) => {
                const active = method === m.key;
                return (
                  <button key={m.key} onClick={() => setMethod(m.key)}
                    className={`rounded-2xl border p-4 text-left transition ${active ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-card"}`}>
                    <m.icon className={`h-5 w-5 ${active ? "text-primary-glow" : "text-muted-foreground"}`} />
                    <div className="mt-3 text-sm font-medium">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.key === "upi" ? "Instant · No fees" : m.key === "card" ? "Visa / Mastercard / Amex" : m.key === "netbanking" ? "All major banks" : "VoltGrid wallet · ₹1,240"}</div>
                  </button>
                );
              })}
            </div>
            {method === "upi" && (
              <div className="mt-4"><input placeholder="username@upi" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" /></div>
            )}
            {method === "card" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <input placeholder="Card number" className="col-span-2 h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input placeholder="MM/YY" className="h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input placeholder="CVV" className="h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            )}
          </div>

          {status === "success" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 text-center border-success/30">
              <div className="mx-auto h-14 w-14 rounded-full bg-success/15 text-success grid place-items-center"><Check className="h-7 w-7" /></div>
              <div className="mt-3 text-lg font-semibold">Payment successful</div>
              <div className="text-sm text-muted-foreground">Receipt sent to your email · TXN-30112</div>
              <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Download receipt</button>
            </motion.div>
          )}
          {status === "failed" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 text-center border-danger/30">
              <div className="mx-auto h-14 w-14 rounded-full bg-danger/15 text-danger grid place-items-center">!</div>
              <div className="mt-3 text-lg font-semibold">Payment failed</div>
              <div className="text-sm text-muted-foreground">Please try again or choose another method.</div>
              <button onClick={() => setStatus("idle")} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Retry</button>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        <div className="glass rounded-2xl p-5 h-fit">
          <div className="text-sm font-semibold mb-4">Bill summary</div>
          <ul className="space-y-3 text-sm">
            {items.map((it) => (
              <li key={it.label} className="flex justify-between"><span className="text-muted-foreground">{it.label}</span><span className="stat">{it.value}</span></li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-4 flex justify-between text-base font-semibold">
            <span>Total</span><span className="stat gradient-text">₹603.22</span>
          </div>
          <button disabled={status === "processing"} onClick={pay}
            className="mt-5 w-full h-11 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:opacity-95 disabled:opacity-60">
            {status === "processing" ? "Processing…" : "Pay ₹603.22"}
          </button>
          <p className="mt-3 text-[10px] text-muted-foreground text-center">Secured by 256-bit TLS · PCI-DSS</p>
        </div>
      </div>
    </div>
  );
}
