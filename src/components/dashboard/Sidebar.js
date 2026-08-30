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
BookMarked,
CreditCard,
} from "lucide-react";

export default function Sidebar({ userRole = "user" }) {
const pathname = usePathname();
const router = useRouter();
const { logout } = useAuth();

// Normalize role
const role = String(userRole || "user").toLowerCase();

// IMPORTANT:
// Librarian has its own dedicated sidebar
// inside /dashboard/librarian/layout.js
if (role === "librarian") {
return null;
}

const menuConfig = {
user: [
{
name: "My Profile",
href: "/dashboard/user",
icon: User,
},
{
name: "Borrowed Books",
href: "/dashboard/user/borrowed",
icon: BookMarked,
},
],

// ```
librarian: [
  {
    name: "Overview",
    href: "/dashboard/librarian",
    icon: BarChart2,
  },
  {
    name: "My Books",
    href: "/dashboard/librarian/my-books",
    icon: BookOpen,
  },
  {
    name: "Add New Book",
    href: "/dashboard/librarian/add-book",
    icon: PlusCircle,
  },
],

admin: [
  {
    name: "Admin Dashboard",
    href: "/dashboard/admin",
    icon: ShieldCheck,
  },
  {
    name: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "All Books",
    href: "/dashboard/admin/books",
    icon: BookOpen,
  },
  {
    name: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
],
// ```

};

// If role is invalid, show user menu
const links = menuConfig[role] || menuConfig.user;

const handleSignOut = async () => {
try {
await logout();
router.push("/");
} catch (error) {
console.error("Logout error:", error);
router.push("/");
}
};

const isLinkActive = (href) => {
// Main dashboard pages should only be active on exact route
if (
href === "/dashboard/admin" ||
href === "/dashboard/librarian" ||
href === "/dashboard/user"
) {
return pathname === href;
}

// ```
// Child dashboard pages
return pathname === href || pathname.startsWith(`${href}/`);
// ```

};

return ( <aside className="w-64 min-h-screen theme-bg-card border-r theme-border flex flex-col justify-between p-4">
{/* TOP SECTION */} <div className="space-y-6">
{/* LOGO */} <div className="px-3 py-2 border-b theme-border"> <Link
         href="/"
         className="flex items-center gap-2"
       > <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950"> <BookOpen className="w-5 h-5" /> </div>

{/* ``` */}
        <span className="text-lg font-extrabold theme-text-primary">
          Biblio<span className="text-amber-500">Drop</span>
        </span>
      </Link>
    </div>

    {/* ROLE BADGE */}
    <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
      <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
        {role} Panel
      </span>
    </div>

    {/* NAVIGATION */}
    <nav className="space-y-1">
      {links.map((item) => {
        const Icon = item.icon;
        const active = isLinkActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
              active
                ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                : "theme-text-secondary hover:bg-amber-500/10 hover:text-amber-500 font-semibold"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  </div>

  {/* BOTTOM SECTION */}
  <div className="space-y-1 pt-4 border-t theme-border">
    {/* BACK TO HOME */}
    <Link
      href="/"
      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium theme-text-secondary hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
    >
      <Home className="w-4 h-4 shrink-0" />
      <span>Back to Home</span>
    </Link>

    {/* SIGN OUT */}
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      <span>Sign Out</span>
    </button>
  </div>
</aside>
// ```

);
}
