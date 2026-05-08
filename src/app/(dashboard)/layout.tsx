import AuthGuard from "@/features/auth/AuthGuard";
import MainLayout from "@/layout/MainLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
