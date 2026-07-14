import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", subtitle, icon: Icon = Inbox, action }: {
  title?: string; subtitle?: string; icon?: LucideIcon; action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
