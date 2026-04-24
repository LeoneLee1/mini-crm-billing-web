"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/services/auth/authService";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

interface PasswordField {
  value: string;
  show: boolean;
}

export default function UpdatePasswordFeatures() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState<PasswordField>({ value: "", show: false });
  const [newPassword, setNewPassword] = useState<PasswordField>({ value: "", show: false });
  const [confirmPassword, setConfirmPassword] = useState<PasswordField>({ value: "", show: false });
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (setter: React.Dispatch<React.SetStateAction<PasswordField>>) => setter((prev) => ({ ...prev, show: !prev.show }));

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (newPassword.value !== confirmPassword.value) {
      Toast.fire({ icon: "error", title: "Password baru dan konfirmasi tidak cocok." });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword({
        old_password: oldPassword.value,
        new_password: newPassword.value,
        confirm_password: confirmPassword.value,
      });
      await Toast.fire({ icon: "success", title: "Password berhasil diubah!" });
      router.push("/profile");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Gagal mengubah password. Silakan coba lagi.";
      Toast.fire({ icon: "error", title: "Gagal", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Ubah Password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div className="space-y-1.5">
            <Label htmlFor="old_password" className="flex items-center gap-1.5 text-gray-600">
              <Lock className="w-3.5 h-3.5" />
              Password Lama
            </Label>
            <div className="relative">
              <Input
                id="old_password"
                type={oldPassword.show ? "text" : "password"}
                className="h-11 pr-10"
                placeholder="Masukkan password lama"
                value={oldPassword.value}
                onChange={(e) => setOldPassword((p) => ({ ...p, value: e.target.value }))}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => toggle(setOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={oldPassword.show ? "Sembunyikan password" : "Tampilkan password"}
              >
                {oldPassword.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="new_password" className="flex items-center gap-1.5 text-gray-600">
              <Lock className="w-3.5 h-3.5" />
              Password Baru
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={newPassword.show ? "text" : "password"}
                className="h-11 pr-10"
                placeholder="Masukkan password baru"
                value={newPassword.value}
                onChange={(e) => setNewPassword((p) => ({ ...p, value: e.target.value }))}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => toggle(setNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={newPassword.show ? "Sembunyikan password" : "Tampilkan password"}
              >
                {newPassword.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password" className="flex items-center gap-1.5 text-gray-600">
              <Lock className="w-3.5 h-3.5" />
              Konfirmasi Password Baru
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={confirmPassword.show ? "text" : "password"}
                className={`h-11 pr-10 ${confirmPassword.value && confirmPassword.value !== newPassword.value ? "border-red-300 focus:ring-red-200" : ""}`}
                placeholder="Ulangi password baru"
                value={confirmPassword.value}
                onChange={(e) => setConfirmPassword((p) => ({ ...p, value: e.target.value }))}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => toggle(setConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={confirmPassword.show ? "Sembunyikan password" : "Tampilkan password"}
              >
                {confirmPassword.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.value && confirmPassword.value !== newPassword.value && <p className="text-xs text-red-500 mt-1">Password tidak cocok.</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-11 text-sm cursor-pointer" onClick={() => router.push("/profile")} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" className="flex-1 h-11 text-sm font-semibold cursor-pointer" disabled={isLoading || (!!confirmPassword.value && confirmPassword.value !== newPassword.value)}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                "Simpan Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
