import type { ReactNode } from "react";

type Col<T> = { key: keyof T | string; header: string; render?: (row: T) => ReactNode; className?: string };

export function DataTable<T extends { id: string }>({ rows, columns, empty }: {
  rows: T[]; columns: Col<T>[]; empty?: ReactNode;
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className={`px-4 py-3 text-left font-medium ${c.className ?? ""}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12">{empty ?? <div className="text-center text-muted-foreground text-sm">No records.</div>}</td></tr>
            ) : rows.map((row) => (
              <tr key={row.id} className="hover:bg-card/40 transition-colors">
                {columns.map((c) => (
                  <td key={String(c.key)} className={`px-4 py-3 ${c.className ?? ""}`}>
                    {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
