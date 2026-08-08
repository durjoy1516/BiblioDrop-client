import Sidebar from "@/components/dashboard/Sidebar";

export const metadata = {
  title: "Dashboard | BiblioDrop",
  description: "User and Provider Management Panel",
};

export default function DashboardLayout({ children }) {
  // Demo Role - Backend context / Auth hook দিয়ে পরে ডায়নামিক করা যাবে
  const userRole = "user"; // Options: "user", "librarian", "admin"

  return (
    <div className="min-h-screen flex theme-bg-main">
      {/* Sidebar Navigation */}
      <div className="hidden md:block">
        <Sidebar userRole={userRole} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}