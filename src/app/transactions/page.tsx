import AuthGuard from "@/features/auth/AuthGuard";
import Transactions from "@/features/transactions/Transactions";
import MainLayout from "@/layout/MainLayout";

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <MainLayout pageTitle="Transactions">
        <Transactions />
      </MainLayout>
    </AuthGuard>
  );
}
