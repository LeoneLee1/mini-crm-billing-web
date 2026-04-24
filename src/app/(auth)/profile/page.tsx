import AuthGuard from "@/features/auth/AuthGuard";
import ProfileFeatures from "@/features/auth/Profile";
import MainLayout from "@/layout/MainLayout";

export default function Profile() {
  return (
    <AuthGuard>
      <MainLayout pageTitle="Profile">
        <ProfileFeatures />
      </MainLayout>
    </AuthGuard>
  );
}
