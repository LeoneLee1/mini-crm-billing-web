import AuthGuard from "@/features/auth/AuthGuard";
import Products from "@/features/products/Products";
import MainLayout from "@/layout/MainLayout";

export default function ProductsPage() {
  return (
    <AuthGuard>
      <MainLayout pageTitle="Products">
        <Products />
      </MainLayout>
    </AuthGuard>
  );
}
