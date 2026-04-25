"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { createCustomer, updateCustomer } from "@/services/customers/customerService";
import { Customer, CreateCustomerPayload, UpdateCustomerPayload } from "@/services/customers/customerTypes";

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
  phone: string;
  address: string;
  status: "active" | "inactive";
}

interface CustomerModalProps {
  mode: "create" | "edit";
  customer: Customer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerModal({ mode, customer, onClose, onSuccess }: CustomerModalProps) {
  const [form, setForm] = useState<FormState>({
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? "",
    status: customer?.status ?? "active",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email format.";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      e.phone = "Phone number must be at least 10 digits.";
    }
    if (!form.address.trim()) e.address = "Address is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (mode === "create") {
        const payload: CreateCustomerPayload = {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          ...(form.email.trim() ? { email: form.email.trim() } : {}),
        };
        await createCustomer(payload);
        Toast.fire({ icon: "success", title: "Success!", text: "Customer created successfully." });
      } else if (customer) {
        const payload: UpdateCustomerPayload = {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          status: form.status,
          ...(form.email.trim() ? { email: form.email.trim() } : {}),
        };
        await updateCustomer(customer.id, payload);
        Toast.fire({ icon: "success", title: "Success!", text: "Customer updated successfully." });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  const inputBase = "w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400";
  const inputOk = "border-gray-200 focus:border-blue-500 bg-white";
  const inputErr = "border-red-400 bg-red-50/30";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md z-10 max-h-[92svh] flex flex-col">

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "create" ? "Add Customer" : "Edit Customer"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto">
          {/* Nama */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name" type="text" value={form.name} onChange={handleChange}
              placeholder="Enter full name"
              className={cn(inputBase, errors.name ? inputErr : inputOk)}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email (opsional) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="email@example.com"
              className={cn(inputBase, errors.email ? inputErr : inputOk)}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Telepon */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="081234567890"
              className={cn(inputBase, errors.phone ? inputErr : inputOk)}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Alamat */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="address" type="text" value={form.address} onChange={handleChange}
              placeholder="123 Main St, City"
              className={cn(inputBase, errors.address ? inputErr : inputOk)}
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          {/* Status — hanya di mode edit */}
          {mode === "edit" && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status" value={form.status} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors appearance-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#1d3494" }}
            >
              {submitting ? "Saving..." : mode === "create" ? "Create Customer" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
