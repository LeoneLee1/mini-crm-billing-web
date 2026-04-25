"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ShieldX } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f9fafb" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: "#1d3494" }} />
          <p className="text-sm text-gray-400">Checking access...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Access Denied</h2>
          <p className="text-gray-500 text-sm">This page is only accessible to Administrators.</p>
        </div>
        <button
          onClick={() => router.replace("/")}
          className="mt-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1d3494" }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
