import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthed: boolean;
  loginAs: (role: Role, email?: string) => void;
  logout: () => void;
};

const demoUsers: Record<Role, AuthUser> = {
  user: { id: "u_1", name: "Aarav Sharma", email: "aarav@voltgrid.io", role: "user", avatar: "AS" },
  admin: { id: "ad_1", name: "Ravi Kapoor", email: "ravi@voltgrid.io", role: "admin", avatar: "RK" },
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthed: false,
      loginAs: (role, email) =>
        set({
          user: { ...demoUsers[role], email: email || demoUsers[role].email },
          isAuthed: true,
        }),
      logout: () => set({ user: null, isAuthed: false }),
    }),
    { name: "voltgrid-auth" },
  ),
);
