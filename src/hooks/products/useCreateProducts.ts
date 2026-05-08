import { useState } from "react";
import { createProduct } from "@/services/products/productService";
import { CreateProductPayload } from "@/services/products/productTypes";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export interface ProductFormState {
  name: string;
  description: string;
  price: string;
  unit: string;
  category: string;
  is_active: boolean;
}

const INITIAL_FORM: ProductFormState = {
  name: "",
  description: "",
  price: "",
  unit: "",
  category: "",
  is_active: true,
};

export function useCreateProducts(onSuccess: () => void) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function openCreateModal() {
    setForm(INITIAL_FORM);
    setErrors({});
    setCreateModalOpen(true);
  }

  function closeCreateModal() {
    setCreateModalOpen(false);
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "is_active") {
      setForm((prev) => ({ ...prev, is_active: value === "true" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof ProductFormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: CreateProductPayload = {
        name: form.name.trim(),
        price: Number(form.price),
        unit: form.unit.trim(),
        ...(form.description.trim() ? { description: form.description.trim() } : {}),
        ...(form.category.trim() ? { category: form.category.trim() } : {}),
      };
      await createProduct(payload);
      Toast.fire({ icon: "success", title: "Success!", text: "Product created successfully." });
      onSuccess();
      closeCreateModal();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function handleCategoryChange(value: string) {
    setForm((prev) => ({ ...prev, category: value }));
  }

  return { createModalOpen, openCreateModal, closeCreateModal, form, errors, submitting, handleChange, handleCategoryChange, handleSubmit };
}
