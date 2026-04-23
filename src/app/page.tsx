"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    const routes: Record<string, string> = {
      superadmin: "/superadmin",
      admin: "/admin",
      tashkilot: "/tashkilot",
      user: "/user",
    };
    if (user) router.replace(routes[user.role] || "/login");
  }, [isAuthenticated, user, router]);

  return null;
}
