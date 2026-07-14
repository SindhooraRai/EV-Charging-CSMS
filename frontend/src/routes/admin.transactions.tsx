import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { transactions } from "@/lib/mock";

export const Route = createFileRoute("/admin/transactions")({
  head: () => ({ meta: [{ title: "Transactions · VoltGrid Admin" }] }),
  component: AdminTxn,
});
function AdminTxn() {
  return (
    <div>
      <PageHeader title="Transactions" subtitle="Platform-wide payments." />
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
