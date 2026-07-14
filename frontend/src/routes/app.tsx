import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, MapPin, Zap, History, Wallet, CreditCard, Bell,
  User, Settings, HelpCircle, Heart, Radio,
} from "lucide-react";
import { PortalShell } from "@/components/layouts/portal-shell";

export const Route = createFileRoute("/app")({ component: AppLayout });

function AppLayout() {
  return (
    <PortalShell
      brand="Driver portal"
      accent="primary"
      nav={[
        {
          label: "Overview",
          items: [
            { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { to: "/app/map", label: "Nearby chargers", icon: MapPin },
            { to: "/app/live", label: "Live session", icon: Zap, badge: "•" },
            { to: "/app/history", label: "Charging history", icon: History },
            { to: "/app/favorites", label: "Favorites", icon: Heart },
          ],
        },
        {
          label: "Wallet & Cards",
          items: [
            { to: "/app/payments", label: "Payments", icon: CreditCard },
            { to: "/app/wallet", label: "Wallet", icon: Wallet },
            { to: "/app/rfid", label: "RFID cards", icon: Radio },
          ],
        },
        {
          label: "Account",
          items: [
            { to: "/app/notifications", label: "Notifications", icon: Bell },
            { to: "/app/profile", label: "Profile", icon: User },
            { to: "/app/settings", label: "Settings", icon: Settings },
            { to: "/app/help", label: "Help center", icon: HelpCircle },
          ],
        },
      ]}
    >
      <Outlet />
    </PortalShell>
  );
}
