import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { stations } from "@/lib/mock";

export const Route = createFileRoute("/app/favorites")({
  head: () => ({ meta: [{ title: "Favorite stations · VoltGrid" }] }),
  component: Favs,
});

function Favs() {
  const favs = stations.slice(0, 4);
  return (
    <div>
      <PageHeader title="Favorite stations" subtitle="Quick access to the chargers you use most." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favs.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.address}</div>
              </div>
              <Heart className="h-5 w-5 text-danger fill-danger" />
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="stat text-foreground">{s.power} kW</span>
              <span>·</span>
              <span className="stat text-foreground">₹{s.price}/kWh</span>
              <span className="ml-auto"><StatusBadge status={s.status} /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
