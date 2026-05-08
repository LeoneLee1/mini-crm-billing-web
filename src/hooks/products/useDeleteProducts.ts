import Swal from "sweetalert2";
import { deleteProduct } from "@/services/products/productService";
import { Product } from "@/services/products/productTypes";
import { Toast } from "@/utils/sweet_alert_utils/Toast";

export function useDeleteProducts(onSuccess: () => void) {
  async function handleDelete(product: Product) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Product?",
      text: `Product "${product.name}" will be deleted permanently.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteProduct(product.id);
      Toast.fire({ icon: "success", title: "Success!", text: "Product deleted successfully." });
      onSuccess();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      Toast.fire({ icon: "error", title: "Failed", text: msg });
    }
  }

  return { handleDelete };
}
