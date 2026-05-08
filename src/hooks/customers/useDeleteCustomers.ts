import Swal from "sweetalert2";
import { deleteCustomer } from "@/services/customers/customerService";
import { Customer } from "@/services/customers/customerTypes";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export function useDeleteCustomers(onSuccess: () => void) {
  async function handleDelete(customer: Customer) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Customer?",
      text: `Customer "${customer.name}" will be deleted permanently.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteCustomer(customer.id);
      Toast.fire({ icon: "success", title: "Success!", text: "Customer successfully deleted." });
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    }
  }

  return { handleDelete };
}
