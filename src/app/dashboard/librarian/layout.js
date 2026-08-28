"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
LayoutDashboard,
PlusCircle,
BookOpen,
Truck,
} from "lucide-react";

export default function LibrarianLayout({ children }) {
const pathname = usePathname();

const navItems = [
{
name: "Overview",
href: "/dashboard/librarian",
icon: LayoutDashboard,
},
{
name: "Add Book",
href: "/dashboard/librarian/add-book",
icon: PlusCircle,
},
{
name: "Manage Inventory",
href: "/dashboard/librarian/inventory",
icon: BookOpen,
},
{
name: "Manage Deliveries",
href: "/dashboard/librarian/deliveries",
icon: Truck,
},
];

return ( <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100">
{/* LIBRARIAN SIDEBAR */} <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6 shrink-0">
{/* LOGO */} <div className="text-xl font-bold text-amber-500 px-2 flex items-center gap-2"> <BookOpen className="w-6 h-6" />
Librarian Portal </div>

{/* ``` */}
    {/* NAVIGATION */}
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard/librarian" &&
            pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  </aside>

  {/* MAIN CONTENT */}
  <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto">
    {children}
  </main>
</div>
// ```

);
}
