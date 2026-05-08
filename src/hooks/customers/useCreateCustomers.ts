import { useState } from "react";
import { createCustomer } from "@/services/customers/customerService";
import { CreateCustomerPayload } from "@/services/customers/customerTypes";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export interface CustomerFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

const INITIAL_FORM: CustomerFormState = { name: "", email: "", phone: "", address: "", status: "active" };

export function useCreateCustomers(onSuccess: () => void) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState<CustomerFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<CustomerFormState>>({});
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
    const e: Partial<CustomerFormState> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Phone number must be at least 10 digits.";
    if (!form.address.trim()) e.address = "Address is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerFormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: CreateCustomerPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
      };
      await createCustomer(payload);
      Toast.fire({ icon: "success", title: "Success!", text: "Customer created successfully." });
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

  return { createModalOpen, openCreateModal, closeCreateModal, form, errors, submitting, handleChange, handleSubmit };
}
