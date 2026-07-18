import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type Role = "user" | "driver" | "admin";

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as Role | null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        // If user's role is not allowed, redirect to correct default page
        if (role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/user/dashboard" replace />;
        }
    }

    return <Outlet />;
}
