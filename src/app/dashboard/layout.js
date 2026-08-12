"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen flex theme-bg-main">
      {/* Sidebar Navigation */}
      <div className="hidden md:block">
        <Sidebar userRole={user?.role || "user"} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}