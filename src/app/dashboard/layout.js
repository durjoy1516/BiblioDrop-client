"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-main flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-main flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0">
        <Sidebar userRole={user?.role || "user"} />
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}