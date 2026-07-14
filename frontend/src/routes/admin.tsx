import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Users, Receipt, DollarSign, AlertTriangle,
  Activity, Settings, Shield, KeyRound, ScrollText, Bell, Radio, Tag,
} from "lucide-react";
import { PortalShell } from "@/components/layouts/portal-shell";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  return (
    <PortalShell
      brand="Admin platform"
      accent="warning"
      nav={[
        {
          label: "Platform",
          items: [
            { to: "/admin/dashboard", label: "Analytics", icon: LayoutDashboard },
            { to: "/admin/users", label: "Users", icon: Users },
            { to: "/admin/stations", label: "Stations", icon: Building2 },
            { to: "/admin/rfid", label: "RFID cards", icon: Radio },
          ],
        },
        {
          label: "Commerce",
          items: [
            { to: "/admin/transactions", label: "Transactions", icon: Receipt },
            { to: "/admin/revenue", label: "Revenue", icon: DollarSign },
            { to: "/admin/pricing", label: "Pricing & Tariffs", icon: Tag },
          ],
        },
        {
          label: "Reliability",
          items: [
            { to: "/admin/faults", label: "Fault reports", icon: AlertTriangle, badge: "3" },
            { to: "/admin/health", label: "System health", icon: Activity },
            { to: "/admin/logs", label: "Logs", icon: ScrollText },
          ],
        },
        {
          label: "Governance",
          items: [
            { to: "/admin/roles", label: "Roles", icon: Shield },
            { to: "/admin/permissions", label: "Permissions", icon: KeyRound },
            { to: "/admin/audit", label: "Audit logs", icon: ScrollText },
            { to: "/admin/settings", label: "Platform settings", icon: Settings },
            { to: "/admin/notifications", label: "Notifications", icon: Bell },
          ],
        },
      ]}
    >
      <Outlet />
    </PortalShell>
  );
}
