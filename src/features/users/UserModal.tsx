"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { createUser, updateUser } from "@/services/users/userService";
import { User, CreateUserPayload, UpdateUserPayload } from "@/services/users/userTypes";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

interface FormState {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
}

interface UserModalProps {
  mode: "create" | "edit";
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserModal({ mode, user, onClose, onSuccess }: UserModalProps) {
  const [form, setForm] = useState<FormState>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "staff",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi.";
    if (!form.email.trim()) {
      e.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Format email tidak valid.";
    }
    if (mode === "create" && !form.password) {
      e.password = "Password wajib diisi.";
    } else if (mode === "create" && form.password.length < 6) {
      e.password = "Password minimal 6 karakter.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (mode === "create") {
        const payload: CreateUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        };
        await createUser(payload);
        Toast.fire({ icon: "success", title: "Berhasil!", text: "User berhasil dibuat." });
      } else if (user) {
        const payload: UpdateUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        };
        await updateUser(user.id, payload);
        Toast.fire({ icon: "success", title: "Berhasil!", text: "User berhasil diperbarui." });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Terjadi kesalahan. Silakan coba lagi.";
      Toast.fire({ icon: "error", title: "Gagal", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md z-10 max-h-[92svh] flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">{mode === "create" ? "Tambah User" : "Edit User"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className={cn("w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400", errors.name ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-500 bg-white")}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@contoh.com"
              className={cn("w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400", errors.email ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-500 bg-white")}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {mode === "create" && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 karakter"
                  className={cn(
                    "w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400",
                    errors.password ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-500 bg-white",
                  )}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors appearance-none cursor-pointer"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1d3494" }}
            >
              {submitting ? "Menyimpan..." : mode === "create" ? "Buat User" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
