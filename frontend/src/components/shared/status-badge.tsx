import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  online: "bg-success/15 text-success border-success/30",
  charging: "bg-primary/15 text-primary-glow border-primary/30",
  fault: "bg-danger/15 text-danger border-danger/30",
  offline: "bg-muted-foreground/10 text-muted-foreground border-border",
  success: "bg-success/15 text-success border-success/30",
  active: "bg-success/15 text-success border-success/30",
  completed: "bg-secondary/15 text-secondary border-secondary/30",
  pending: "bg-warning/15 text-warning border-warning/30",
  failed: "bg-danger/15 text-danger border-danger/30",
  suspended: "bg-danger/15 text-danger border-danger/30",
  critical: "bg-danger/20 text-danger border-danger/40",
  high: "bg-warning/20 text-warning border-warning/40",
  medium: "bg-primary/15 text-primary-glow border-primary/30",
  low: "bg-muted-foreground/10 text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", map[status] ?? map.offline)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
