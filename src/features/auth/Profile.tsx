"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Calendar, RefreshCw, KeyRound } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { getProfile, updateProfile } from "@/services/auth/authService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfileFeatures() {
  const router = useRouter();
  const storeUser = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        const user = res.data ?? res;
        setName(user.name ?? "");
        setEmail(user.email ?? "");
        setCreatedAt(user.created_at ?? "");
        setUpdatedAt(user.updated_at ?? "");
      } catch {
        // fallback ke store jika API gagal
        if (storeUser) {
          setName(storeUser.name);
          setEmail(storeUser.email);
          setCreatedAt(storeUser.created_at);
          setUpdatedAt(storeUser.updated_at);
        }
      } finally {
        setIsFetching(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({ name, email });

      // Refetch dari server supaya store (dan Header) langsung sync
      const fresh = await getProfile();
      const serverUser = fresh?.data ?? fresh;
      if (serverUser?.id) {
        updateUser(serverUser);
        setName(serverUser.name ?? name);
        setEmail(serverUser.email ?? email);
        if (serverUser.updated_at) setUpdatedAt(serverUser.updated_at);
        if (serverUser.created_at) setCreatedAt(serverUser.created_at);
      } else {
        updateUser({ name, email });
      }

      Toast.fire({ icon: "success", title: "Profil berhasil diperbarui!" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Gagal memperbarui profil. Silakan coba lagi.";
      Toast.fire({ icon: "error", title: "Gagal", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const initials = getInitials(name || storeUser?.name || "?");

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Profile summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 select-none" style={{ backgroundColor: "#1d3494" }}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-gray-800 truncate">{name}</p>
          <p className="text-sm text-gray-400 truncate">{email}</p>
          {createdAt && <p className="text-xs text-gray-300 mt-1">Member sejak {formatDate(createdAt)}</p>}
        </div>
      </div>

      {/* Edit form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Edit Profil</h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="flex items-center gap-1.5 text-gray-600">
              <User className="w-3.5 h-3.5" />
              Full Name
            </Label>
            <Input id="name" type="text" className="h-11" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} placeholder="Nama lengkap" />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-gray-600">
              <Mail className="w-3.5 h-3.5" />
              Email
            </Label>
            <Input id="email" type="email" className="h-11" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSaving} placeholder="Email address" />
          </div>

          {/* Timestamps — read only */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-400 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                Member Sejak
              </Label>
              <Input className="h-11 bg-gray-50 text-gray-400 cursor-default text-sm" value={createdAt ? formatDate(createdAt) : "—"} readOnly tabIndex={-1} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-gray-400 text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                Terakhir Diperbarui
              </Label>
              <Input className="h-11 bg-gray-50 text-gray-400 cursor-default text-sm" value={updatedAt ? formatDate(updatedAt) : "—"} readOnly tabIndex={-1} />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" className="flex-1 h-11 text-sm font-semibold cursor-pointer" disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
            <Button type="button" variant="outline" className="h-11 px-4 text-sm cursor-pointer flex items-center gap-2 shrink-0" onClick={() => router.push("/profile/update-password")} disabled={isSaving}>
              <KeyRound className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
