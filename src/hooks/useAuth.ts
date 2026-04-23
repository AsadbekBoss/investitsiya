"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout, hasRole } =
    useAuthStore();
  const router = useRouter();

  const redirectByRole = () => {
    if (!user) return router.push("/login");
    const routes: Record<string, string> = {
      superadmin: "/superadmin",
      admin: "/admin",
      tashkilot: "/tashkilot",
      user: "/user",
    };
    router.push(routes[user.role] || "/login");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return { user, token, isAuthenticated, setAuth, logout: handleLogout, hasRole, redirectByRole };
}
