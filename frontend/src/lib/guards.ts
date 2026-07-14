import { redirect } from "@tanstack/react-router";
import type { Role } from "@/store/auth";
import { useAuth } from "@/store/auth";

export function requireRole(role: Role) {
  // Runs in beforeLoad — client-side only guard (mock auth).
  if (typeof window === "undefined") return;
  const state = useAuth.getState();
  if (!state.isAuthed || state.user?.role !== role) {
    throw redirect({ to: "/auth/login", search: { role } });
  }
}
