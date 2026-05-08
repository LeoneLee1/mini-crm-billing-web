"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomerFormState } from "@/hooks/customers/useCreateCustomers";

interface CustomerModalProps {
  mode: "create" | "edit";
  form: CustomerFormState;
  errors: Partial<CustomerFormState>;
  submitting: boolean;
  onClose: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (ev: React.SyntheticEvent<HTMLFormElement>) => void;
}

export default function CustomerModal({ mode, form, errors, submitting, onClose, handleChange, handleSubmit }: CustomerModalProps) {
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
