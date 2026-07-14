import { createFileRoute } from "@tanstack/react-router";
import { Search, LifeBuoy, MessageSquare, Book } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faq } from "@/lib/mock";

export const Route = createFileRoute("/app/help")({
  head: () => ({ meta: [{ title: "Help center · VoltGrid" }] }),
  component: Help,
});

function Help() {
  return (
    <div>
      <PageHeader title="Help center" subtitle="Answers, guides, and 24×7 chat support." />
      <div className="relative max-w-xl mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input placeholder="Search help articles…" className="w-full h-11 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[
          { icon: Book, t: "Getting started", d: "Set up your account and vehicle." },
          { icon: LifeBuoy, t: "Troubleshooting", d: "Fix charging errors quickly." },
          { icon: MessageSquare, t: "Contact support", d: "Chat with a human in seconds." },
        ].map((c) => (
          <div key={c.t} className="glass rounded-2xl p-5 card-hover">
            <c.icon className="h-5 w-5 text-primary-glow" />
            <div className="mt-3 text-sm font-semibold">{c.t}</div>
            <div className="text-xs text-muted-foreground">{c.d}</div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl px-6">
        <Accordion type="single" collapsible>
          {faq.map((f, i) => (
            <AccordionItem key={f.q} value={`h-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
