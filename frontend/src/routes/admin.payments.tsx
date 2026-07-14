import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { transactions } from "@/lib/mock";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments · VoltGrid Admin" }] }),
  component: AdminPayments,
});
function AdminPayments() {
  return (
    <div>
      <PageHeader title="Payments" subtitle="Payment operations and refunds." />
      <DataTable rows={transactions} columns={[
        { key: "id", header: "Txn", render: (r) => <span className="stat text-muted-foreground">{r.id}</span> },
        { key: "user", header: "User" },
        { key: "station", header: "Station" },
        { key: "method", header: "Method" },
        { key: "amount", header: "Amount", render: (r) => <span className="stat">₹{r.amount}</span> },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "date", header: "Date" },
      ]} />
    </div>
  );
}
