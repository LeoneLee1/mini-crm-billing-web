import AuthGuard from "@/features/auth/AuthGuard";
import UpdatePasswordFeatures from "@/features/auth/UpdatePassword";
import MainLayout from "@/layout/MainLayout";

export default function UpdatePassword() {
  return (
    <AuthGuard>
      <MainLayout pageTitle="Profile - Update Password">
        <UpdatePasswordFeatures />
      </MainLayout>
    </AuthGuard>
  );
}
