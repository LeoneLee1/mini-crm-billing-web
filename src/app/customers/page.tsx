import AuthGuard from "@/features/auth/AuthGuard";
import Customers from "@/features/customers/Customers";
import MainLayout from "@/layout/MainLayout";

export default function CustomersPage() {
  return (
    <AuthGuard>
      <MainLayout pageTitle="Customers">
        <Customers />
      </MainLayout>
    </AuthGuard>
  );
}
