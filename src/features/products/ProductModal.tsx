"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { createProduct, updateProduct } from "@/services/products/productService";
import { Product, CreateProductPayload, UpdateProductPayload } from "@/services/products/productTypes";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

interface FormState {
  name: string;
  description: string;
  price: string;
  unit: string;
  category: string;
  is_active: boolean;
}

interface ProductModalProps {
  mode: "create" | "edit";
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductModal({ mode, product, onClose, onSuccess }: ProductModalProps) {
  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ? String(product.price) : "",
    unit: product?.unit ?? "",
    category: product?.category ?? "",
    is_active: product?.is_active ?? true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) {
      e.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    }
    const priceNum = Number(form.price);
    if (!form.price || isNaN(priceNum) || priceNum <= 0) {
      e.price = "Price is required and must be greater than 0.";
    }
    if (!form.unit.trim()) e.unit = "Unit is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (mode === "create") {
        const payload: CreateProductPayload = {
          name: form.name.trim(),
          price: Number(form.price),
          unit: form.unit.trim(),
          ...(form.description.trim() ? { description: form.description.trim() } : {}),
          ...(form.category.trim() ? { category: form.category.trim() } : {}),
        };
        await createProduct(payload);
        Toast.fire({ icon: "success", title: "Success!", text: "Product created successfully." });
      } else if (product) {
        const payload: UpdateProductPayload = {
          name: form.name.trim(),
          price: Number(form.price),
          unit: form.unit.trim(),
          is_active: form.is_active,
          ...(form.description.trim() ? { description: form.description.trim() } : {}),
          ...(form.category.trim() ? { category: form.category.trim() } : {}),
        };
        await updateProduct(product.id, payload);
        Toast.fire({ icon: "success", title: "Success!", text: "Product updated successfully." });
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "is_active") {
      setForm((prev) => ({ ...prev, is_active: value === "true" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof FormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

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
          {/* Name */}
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

          {/* Description */}
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

          {/* Price + Unit — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                name="price" type="number" min="0.01" step="0.01"
                value={form.price} onChange={handleChange}
                placeholder="0"
                className={cn(inputBase, errors.price ? inputErr : inputOk)}
              />
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

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>
            <input
              name="category" type="text" value={form.category} onChange={handleChange}
              placeholder="e.g. Food, Beverage, Service"
              className={cn(inputBase, inputOk)}
            />
          </div>

          {/* Status — edit only */}
          {mode === "edit" && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="is_active" value={form.is_active ? "true" : "false"} onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 bg-white transition-colors appearance-none cursor-pointer"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
              {submitting ? "Saving..." : mode === "create" ? "Create Product" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
