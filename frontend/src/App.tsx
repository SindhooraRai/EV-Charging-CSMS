import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Layout Wrapper Modules
import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/Layout/AdminLayout";

// Public pages
import Landing from "./pages/Public/Landing";
import Login from "./pages/Public/Login";
import Register from "./pages/Public/Register";
import ForgotPassword from "./pages/Public/ForgotPassword";
import NotFound from "./pages/Public/NotFound";

// Driver/User Pages
import UserDashboard from "./pages/User/Dashboard";
import NearbyChargers from "./pages/User/NearbyChargers";
import UserStationDetails from "./pages/User/StationDetails";
import LiveCharging from "./pages/User/LiveCharging";
import BillSummary from "./pages/User/BillSummary";
import PaymentSuccess from "./pages/User/PaymentSuccess";
import ChargingHistory from "./pages/User/ChargingHistory";
import RFIDCard from "./pages/User/RFIDCard";
import Notifications from "./pages/User/Notifications";
import Profile from "./pages/User/Profile";
import UserSettings from "./pages/User/Settings";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminStations from "./pages/Admin/Stations";
import AdminStationDetails from "./pages/Admin/StationDetails";
import AdminLiveSessions from "./pages/Admin/LiveSessions";
import AdminTransactions from "./pages/Admin/Transactions";
import AdminAnalytics from "./pages/Admin/Analytics";
import AdminAlerts from "./pages/Admin/Alerts";
import AdminSettings from "./pages/Admin/SystemSettings";
import AdminProfile from "./pages/Admin/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes Tree */}
        <Route element={<Outlet />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Driver/User Routes Tree */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="nearby" element={<NearbyChargers />} />
          <Route path="stations/:id" element={<UserStationDetails />} />
          <Route path="live" element={<LiveCharging />} />
          <Route path="bill" element={<BillSummary />} />
          <Route path="success" element={<PaymentSuccess />} />
          <Route path="history" element={<ChargingHistory />} />
          <Route path="rfid" element={<RFIDCard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

        {/* C-level Admin / Operators Tree */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stations" element={<AdminStations />} />
          <Route path="stations/:id" element={<AdminStationDetails />} />
          <Route path="live" element={<AdminLiveSessions />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="alerts" element={<AdminAlerts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Global Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
