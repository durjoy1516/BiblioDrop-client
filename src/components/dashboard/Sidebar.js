"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  BookOpen, 
  PlusCircle, 
  Users, 
  BarChart2, 
  LogOut, 
  Home,
  ShieldCheck,
  BookMarked
} from "lucide-react";

export default function Sidebar({ userRole = "user" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const menuConfig = {
    user: [
      { name: "My Profile", href: "/dashboard/user", icon: User },
      { name: "Borrowed Books", href: "/dashboard/user/borrowed", icon: BookMarked },
    ],
    librarian: [
      { name: "Overview", href: "/dashboard/librarian", icon: BarChart2 },
      { name: "My Books", href: "/dashboard/librarian/my-books", icon: BookOpen },
      { name: "Add New Book", href: "/dashboard/librarian/add-book", icon: PlusCircle },
    ],
    admin: [
      { name: "Admin Dashboard", href: "/dashboard/admin", icon: ShieldCheck },
      { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      { name: "All Books List", href: "/dashboard/admin/books", icon: BookOpen },
    ],
  };

  const links = menuConfig[userRole] || menuConfig.user;

  // 🔴 Sign Out & Redirect to Homepage
  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="w-64 theme-bg-card border-r theme-border min-h-screen flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="px-3 py-2 border-b theme-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold theme-text-primary">
              Biblio<span className="text-amber-500">Drop</span>
            </span>
          </Link>
        </div>

        <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            {userRole} Panel
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "theme-text-secondary hover:bg-amber-500/10 hover:text-amber-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 pt-4 border-t theme-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium theme-text-secondary hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}