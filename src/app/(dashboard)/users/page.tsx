import AdminGuard from "@/features/auth/AdminGuard";
import Users from "@/features/users/Users";

export default function UsersPage() {
  return (
    <AdminGuard>
      <Users />
    </AdminGuard>
  );
}
