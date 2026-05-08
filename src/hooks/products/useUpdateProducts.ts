import { useState } from "react";
import { updateProduct } from "@/services/products/productService";
import { Product, UpdateProductPayload } from "@/services/products/productTypes";
import { Toast } from "@/utils/sweet_alert_utils/Toast";
import { ProductFormState } from "@/hooks/products/useCreateProducts";

export function useUpdateProducts(onSuccess: () => void) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>({
    name: "", description: "", price: "", unit: "", category: "", is_active: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function openEditModal(product: Product) {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price ? String(product.price) : "",
      unit: product.unit,
      category: product.category ?? "",
      is_active: product.is_active,
    });
    setErrors({});
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setSelectedProduct(null);
  }

  function validate(): boolean {
    const e: Partial<Record<keyof ProductFormState, string>> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    const priceNum = Number(form.price);
    if (!form.price || isNaN(priceNum) || priceNum <= 0) e.price = "Price is required and must be greater than 0.";
    if (!form.unit.trim()) e.unit = "Unit is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProductFormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleStatusChange(value: string) {
    setForm((prev) => ({ ...prev, is_active: value === "true" }));
  }

  function handleCategoryChange(value: string) {
    setForm((prev) => ({ ...prev, category: value }));
  }

  async function handleSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validate() || !selectedProduct) return;
    setSubmitting(true);
    try {
      const payload: UpdateProductPayload = {
        name: form.name.trim(),
        price: Number(form.price),
        unit: form.unit.trim(),
        is_active: form.is_active,
        ...(form.description.trim() ? { description: form.description.trim() } : {}),
        ...(form.category.trim() ? { category: form.category.trim() } : {}),
      };
      await updateProduct(selectedProduct.id, payload);
      Toast.fire({ icon: "success", title: "Success!", text: "Product updated successfully." });
      onSuccess();
      closeEditModal();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return { editModalOpen, selectedProduct, openEditModal, closeEditModal, form, errors, submitting, handleChange, handleCategoryChange, handleStatusChange, handleSubmit };
}
