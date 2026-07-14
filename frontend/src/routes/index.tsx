import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Zap, Battery, Cpu, LineChart, ShieldCheck, MapPin, Users, Gauge,
  Menu, ArrowRight, Sparkles, Check, Twitter, Github, Linkedin,
} from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faq, testimonials } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoltGrid — EV Charging Station Management Platform" },
      { name: "description", content: "One platform to run your entire EV charging network: live telemetry, revenue analytics, dynamic pricing, and a delightful driver app." },
      { property: "og:title", content: "VoltGrid — EV Charging Station Management" },
      { property: "og:description", content: "Live telemetry, revenue analytics, dynamic pricing, and a delightful driver app for EV charging operators." },
    ],
  }),
  component: Landing,
});

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-white shadow-lg">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-semibold font-[family-name:var(--font-display)]">VoltGrid</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#tech" className="hover:text-foreground">Technology</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/auth/login" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">Sign in</Link>
          <Link to="/auth/register" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button className="md:hidden rounded-lg border border-border bg-surface p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 text-sm space-y-3">
          <a href="#features" onClick={() => setOpen(false)} className="block">Features</a>
          <a href="#how" onClick={() => setOpen(false)} className="block">How it works</a>
          <a href="#tech" onClick={() => setOpen(false)} className="block">Technology</a>
          <a href="#faq" onClick={() => setOpen(false)} className="block">FAQ</a>
          <Link to="/auth/login" className="block">Sign in</Link>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.06)_1px,transparent_0)] [background-size:24px_24px]" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary-glow" /> OCPP 2.0.1 · Real-time telemetry · Multi-tenant
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Run your entire<br />
            <span className="gradient-text">EV charging network</span><br />
            from one control plane.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground">
            VoltGrid unifies live station telemetry, dynamic pricing, revenue analytics and a delightful driver experience — built for operators shipping at scale.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95">
              Explore admin console <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/app/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium hover:bg-card">
              Driver app preview
            </Link>
          </motion.div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "12,480", l: "Live stations" },
              { k: "1.4M+", l: "Sessions/mo" },
              { k: "99.98%", l: "Uptime" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-semibold stat">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <EVIllustration />
      </div>
    </section>
  );
}

function EVIllustration() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
      className="relative aspect-square rounded-3xl border border-border glass p-6 overflow-hidden">
      {/* Concentric energy rings */}
      <div className="absolute inset-0 grid place-items-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i}
            className="absolute rounded-full border border-primary/25"
            style={{ width: `${40 + i * 18}%`, height: `${40 + i * 18}%` }}
            animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.02, 1] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      {/* Car SVG */}
      <div className="relative h-full grid place-items-center">
        <motion.svg viewBox="0 0 240 120" className="w-4/5"
          initial={{ y: 4 }} animate={{ y: [4, -2, 4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <defs>
            <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2563EB" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {/* Ground shadow */}
          <ellipse cx="120" cy="112" rx="88" ry="4" fill="oklch(0 0 0 / 0.4)" />
          {/* Body */}
          <path d="M20 82 C30 60, 60 40, 96 40 L160 40 C186 40, 208 60, 220 82 L220 92 C220 96, 216 100, 212 100 L28 100 C24 100, 20 96, 20 92 Z" fill="url(#body)" />
          {/* Cabin */}
          <path d="M60 60 C72 46, 92 42, 110 42 L152 42 C168 44, 182 52, 190 62 L190 74 L60 74 Z" fill="oklch(0.278 0.041 260.03)" opacity="0.85" />
          {/* Windows */}
          <path d="M74 60 L108 48 L150 48 L172 60 Z" fill="oklch(0.72 0.19 254 / 0.5)" />
          {/* Wheels */}
          <circle cx="66" cy="100" r="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <circle cx="174" cy="100" r="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <circle cx="66" cy="100" r="5" fill="#334155" />
          <circle cx="174" cy="100" r="5" fill="#334155" />
          {/* Charging plug */}
          <rect x="6" y="70" width="14" height="18" rx="2" fill="#10B981" />
          <line x1="0" y1="79" x2="6" y2="79" stroke="#10B981" strokeWidth="3" />
        </motion.svg>
        {/* Battery bar */}
        <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-border bg-surface/80 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Battery className="h-3.5 w-3.5 text-secondary" /> Charging · 150 kW</span>
            <span className="stat text-foreground">78%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-background overflow-hidden">
            <motion.div initial={{ width: "20%" }} animate={{ width: "78%" }} transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-secondary to-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatsBand() {
  const stats = [
    { k: "42 GWh", l: "Energy delivered" },
    { k: "2,180+", l: "Operators onboarded" },
    { k: "18 ms", l: "Avg OCPP latency" },
    { k: "SOC 2", l: "Type II certified" },
  ];
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <div className="text-3xl font-semibold stat gradient-text">{s.k}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Gauge, title: "Real-time telemetry", body: "Every connector, every heartbeat. Sub-second visibility into your fleet." },
    { icon: LineChart, title: "Revenue analytics", body: "Cohort by station, connector, tariff — export to your BI stack." },
    { icon: MapPin, title: "Driver-first map", body: "Nearest chargers, live availability, and one-tap start with RFID or app." },
    { icon: ShieldCheck, title: "OCPP-compliant", body: "Certified 1.6-J and 2.0.1. TLS-mutual auth. Zero-trust station links." },
    { icon: Cpu, title: "Remote operations", body: "Restart, firmware push, connector-level lock/unlock — from anywhere." },
    { icon: Users, title: "Multi-tenant", body: "White-labelled portals for operators, drivers, and fleet managers." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-primary-glow">Features</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold">The control plane for modern EV networks</h2>
        <p className="mt-3 text-muted-foreground">Built with the primitives every operator needs — and none of the ones they don't.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6 card-hover">
            <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary-glow grid place-items-center"><it.icon className="h-5 w-5" /></div>
            <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const rows = [
    "Cut fault triage time from hours to minutes with connector-level alerts.",
    "Dynamic pricing with peak/off-peak, TOU, and RFID-based tariffs.",
    "Fleet-grade access controls with roles, audit logs, and API tokens.",
    "Payments across UPI, card, net-banking, wallet — GST-compliant receipts.",
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <div className="text-xs uppercase tracking-widest text-secondary">Why operators pick VoltGrid</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Grow revenue. Reduce downtime. Delight drivers.</h2>
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r} className="flex gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-secondary/15 text-secondary grid place-items-center"><Check className="h-3 w-3" /></span>
              {r}
            </li>
          ))}
        </ul>
      </div>
      <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Revenue · Last 30d</div>
          <div className="text-xs stat text-success">+18.4%</div>
        </div>
        <div className="mt-3 h-40 flex items-end gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => {
            const h = 30 + Math.sin(i / 3) * 22 + Math.random() * 20;
            return <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary-glow" style={{ height: `${h}%` }} />;
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-border bg-surface/60 py-3"><div className="stat">₹8.4L</div><div className="text-xs text-muted-foreground">Today</div></div>
          <div className="rounded-lg border border-border bg-surface/60 py-3"><div className="stat">₹1.2Cr</div><div className="text-xs text-muted-foreground">Month</div></div>
          <div className="rounded-lg border border-border bg-surface/60 py-3"><div className="stat">₹14.6Cr</div><div className="text-xs text-muted-foreground">YTD</div></div>
        </div>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Connect stations", d: "Bring any OCPP-compliant charger online in under 5 minutes." },
    { n: "02", t: "Configure pricing", d: "Set tariffs by time, connector type, or user cohort." },
    { n: "03", t: "Launch driver app", d: "White-labelled app with maps, RFID, wallets, and receipts." },
    { n: "04", t: "Scale confidently", d: "Real-time telemetry, alerts, and SLA reporting keep you ahead." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-primary-glow">How it works</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold">From first station to production in a week</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-6 relative">
            <div className="text-xs stat text-primary-glow">{s.n}</div>
            <div className="mt-2 text-lg font-semibold">{s.t}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  const events = [
    { t: "0s", label: "Driver taps 'Start'", color: "bg-primary" },
    { t: "0.4s", label: "OCPP StartTransaction accepted", color: "bg-primary-glow" },
    { t: "1s", label: "Connector locks, contactor closes", color: "bg-secondary" },
    { t: "2s", label: "Live telemetry streams", color: "bg-secondary" },
    { t: "42m", label: "Session complete · receipt issued", color: "bg-success" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="glass rounded-3xl p-6 md:p-10">
        <div className="text-xs uppercase tracking-widest text-secondary">Charging process timeline</div>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold">What happens under the hood</h2>
        <div className="mt-8 relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border md:left-0 md:top-6 md:bottom-6 md:h-px md:w-full" />
          <div className="grid gap-6 md:grid-cols-5">
            {events.map((e, i) => (
              <motion.div key={e.label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="relative pl-10 md:pl-0 md:pt-10">
                <div className={`absolute left-2 top-1.5 md:left-1/2 md:-translate-x-1/2 md:top-2 h-3 w-3 rounded-full ${e.color} animate-pulse-ring`} />
                <div className="text-xs stat text-muted-foreground">{e.t}</div>
                <div className="text-sm font-medium mt-1">{e.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const stack = ["React 19", "TypeScript", "Tailwind CSS", "TanStack Router", "Zustand", "Framer Motion", "Recharts", "React Leaflet", "Socket.IO", "OCPP 2.0.1"];
  return (
    <section id="tech" className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-primary-glow">Technology</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Modern stack. Boring in the best way.</h2>
      <div className="mt-8 flex flex-wrap gap-3">
        {stack.map((s) => (
          <span key={s} className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition">
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-xs uppercase tracking-widest text-secondary">Testimonials</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Trusted by operators shipping at scale</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.blockquote key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6">
            <p className="text-sm leading-relaxed">"{t.quote}"</p>
            <footer className="mt-4">
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-xs uppercase tracking-widest text-primary-glow text-center">FAQ</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-center">Answers to common questions</h2>
      <Accordion type="single" collapsible className="mt-8 glass rounded-2xl px-6">
        {faq.map((f, i) => (
          <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-16">
      <div className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center overflow-hidden relative">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold">Talk to our platform team</h2>
          <p className="mt-3 text-muted-foreground">See a personalized demo tailored to your fleet, or ask us anything about OCPP, tariffs, or integrations.</p>
        </div>
        <form className="relative space-y-3" onSubmit={(e) => { e.preventDefault(); }}>
          <input placeholder="Name" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <input placeholder="Work email" className="w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <textarea placeholder="How can we help?" rows={3} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-95">Request demo <ArrowRight className="h-4 w-4" /></button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-white"><Zap className="h-4 w-4" /></div>
            <span className="font-semibold font-[family-name:var(--font-display)]">VoltGrid</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">The control plane for modern EV charging networks.</p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#features">Features</a></li>
            <li><Link to="/admin/dashboard">Admin console</Link></li>
            <li><Link to="/app/dashboard">Driver app</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>About</li><li>Careers</li><li>Press</li><li>Contact</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Privacy</li><li>Terms</li><li>Security</li><li>DPA</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VoltGrid Inc. All rights reserved.
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div>
      <Nav />
      <Hero />
      <StatsBand />
      <Features />
      <Benefits />
      <HowItWorks />
      <Timeline />
      <TechStack />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
