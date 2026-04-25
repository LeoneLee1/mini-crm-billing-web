import AuthGuard from "@/features/auth/AuthGuard";
import AdminGuard from "@/features/auth/AdminGuard";
import Users from "@/features/users/Users";
import MainLayout from "@/layout/MainLayout";

export default function UsersPage() {
  return (
    <AuthGuard>
      <AdminGuard>
        <MainLayout pageTitle="Users">
          <Users />
        </MainLayout>
      </AdminGuard>
    </AuthGuard>
  );
}
