"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/products": "Products",
  "/transactions": "Transactions",
  "/users": "Users",
  "/profile": "Profile",
  "/profile/update-password": "Update Password",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-h-screen lg:ml-64">
        <Header pageTitle={pageTitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
    </div>
  );
}
