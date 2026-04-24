import Dashboard from "@/features/Dashboard";
import MainLayout from "@/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout pageTitle="Dashboard">
      <Dashboard />
    </MainLayout>
  );
}
