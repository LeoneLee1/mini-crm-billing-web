import { useState } from "react";
import { updateCustomer } from "@/services/customers/customerService";
import { Customer, UpdateCustomerPayload } from "@/services/customers/customerTypes";
import { Toast } from "@/utils/sweet_alert_utils/Toast";
import { CustomerFormState } from "@/hooks/customers/useCreateCustomers";

export function useUpdateCustomers(onSuccess: () => void) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormState>({ name: "", email: "", phone: "", address: "", status: "active" });
  const [errors, setErrors] = useState<Partial<CustomerFormState>>({});
  const [submitting, setSubmitting] = useState(false);

  function openEditModal(customer: Customer) {
    setSelectedCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email ?? "",
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
    });
    setErrors({});
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setSelectedCustomer(null);
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
    if (!validate() || !selectedCustomer) return;
    setSubmitting(true);
    try {
      const payload: UpdateCustomerPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        status: form.status,
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
      };
      await updateCustomer(selectedCustomer.id, payload);
      Toast.fire({ icon: "success", title: "Success!", text: "Customer updated successfully." });
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

  return { editModalOpen, selectedCustomer, openEditModal, closeEditModal, form, errors, submitting, handleChange, handleSubmit };
}
