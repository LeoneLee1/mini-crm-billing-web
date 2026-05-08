"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectField } from "@/components/ui/select-field";
import { ProductFormState } from "@/hooks/products/useCreateProducts";

const CATEGORY_OPTIONS = [
  { label: "Web Development", value: "Web Development" },
  { label: "Mobile Development", value: "Mobile Development" },
  { label: "Infrastructure", value: "Infrastructure" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Consultation", value: "Consultation" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Design", value: "Design" },
  { label: "Other", value: "Other" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

interface ProductModalProps {
  mode: "create" | "edit";
  form: ProductFormState;
  errors: Partial<Record<keyof ProductFormState, string>>;
  submitting: boolean;
  onClose: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: string) => void;
  handleStatusChange?: (value: string) => void;
  handleSubmit: (ev: React.SyntheticEvent<HTMLFormElement>) => void;
}

export default function ProductModal({ mode, form, errors, submitting, onClose, handleChange, handleCategoryChange, handleStatusChange, handleSubmit }: ProductModalProps) {
  const inputBase = "w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors placeholder:text-gray-400";
  const inputOk = "border-gray-200 focus:border-blue-500 bg-white";
  const inputErr = "border-red-400 bg-red-50/30";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg z-10 max-h-[92svh] flex flex-col">

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name" type="text" value={form.name} onChange={handleChange}
              placeholder="Enter product name (min. 2 characters)"
              className={cn(inputBase, errors.name ? inputErr : inputOk)}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Enter product description..."
              rows={3}
              className={cn(inputBase, "resize-none", inputOk)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <div
                className={cn(
                  "flex items-center rounded-lg border overflow-hidden transition-colors",
                  errors.price
                    ? "border-red-400 bg-red-50/30"
                    : "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15"
                )}
              >
                <span className="px-3 py-2.5 text-xs font-semibold text-gray-400 bg-gray-50 border-r border-inherit whitespace-nowrap select-none">
                  IDR
                </span>
                <input
                  name="price"
                  type="text"
                  inputMode="numeric"
                  value={form.price ? Number(form.price).toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    handleChange({ target: { name: "price", value: raw } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  placeholder="1.000.000"
                  className="flex-1 px-3.5 py-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                />
              </div>
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Unit <span className="text-red-500">*</span>
              </label>
              <input
                name="unit" type="text" value={form.unit} onChange={handleChange}
                placeholder="pcs, pack, hour..."
                className={cn(inputBase, errors.unit ? inputErr : inputOk)}
              />
              {errors.unit && <p className="text-xs text-red-500">{errors.unit}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <SelectField
              value={form.category}
              onChange={handleCategoryChange}
              options={[{ label: "Select category...", value: "" }, ...CATEGORY_OPTIONS]}
              placeholder="Select category..."
            />
          </div>

          {mode === "edit" && handleStatusChange && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <SelectField
                value={form.is_active ? "true" : "false"}
                onChange={handleStatusChange}
                options={STATUS_OPTIONS}
              />
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
              {submitting ? "Saving..." : mode === "create" ? "Create Product" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
