"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getProfile } from "@/services/auth/authService";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const updateUser = useAuthStore((s) => s.updateUser);

  useEffect(() => {
    if (!_hasHydrated) return;

    const check = async () => {
      const token = useAuthStore.getState().accessToken;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await getProfile();
        const user = res?.data ?? res;
        if (user?.id) updateUser(user);
        setIsAuthorized(true);
      } catch {
        clearAuth();
        router.replace("/login");
      }
    };

    check();
  }, [_hasHydrated, router, clearAuth, updateUser]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f9fafb" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: "#1d3494" }} />
          <p className="text-sm text-gray-400">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
