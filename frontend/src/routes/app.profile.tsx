import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile · VoltGrid" }] }),
  component: Profile,
});

function Profile() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="Profile" subtitle="Manage your driver profile and vehicle info." />
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary grid place-items-center text-white text-xl font-semibold">AS</div>
          <div>
            <div className="text-lg font-semibold">Aarav Sharma</div>
            <div className="text-sm text-muted-foreground">aarav@voltgrid.io · Bengaluru</div>
          </div>
          <button className="ml-auto rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-card">Change photo</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="First name" value="Aarav" />
          <Field label="Last name" value="Sharma" />
          <Field label="Email" value="aarav@voltgrid.io" />
          <Field label="Phone" value="+91 98450 12345" />
          <Field label="Vehicle" value="Tata Nexon EV Max" />
          <Field label="License plate" value="KA-05 HB 4821" />
          <div className="md:col-span-2">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input defaultValue={value} className="mt-1 w-full h-11 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    </label>
  );
}
