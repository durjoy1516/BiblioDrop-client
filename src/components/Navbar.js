"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Moon, Sun, Menu, Search, User, LogOut, LayoutDashboard, UserCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Outside click event listener to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "librarian") return "/dashboard/librarian";
    return "/dashboard/user";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Books", href: "/books" },
    ...(user ? [{ name: "Dashboard", href: getDashboardPath() }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Header Bar */}
      <div className="theme-bg-card border-b theme-border px-4 lg:px-8 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-bold transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-extrabold tracking-tight theme-text-primary">
              Biblio<span className="text-amber-500">Drop</span>
            </span>
          </Link>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form action="/books" className="relative w-full">
              <input
                type="text"
                name="search"
                placeholder="Search books, authors, categories..."
                className="w-full py-1.5 pl-4 pr-10 text-xs md:text-sm rounded-xl theme-text-primary bg-amber-500/5 border theme-border focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-amber-500 text-slate-950 font-bold px-3 rounded-r-xl flex items-center hover:bg-amber-400 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Actions & Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors"
                title="Toggle Light/Dark Theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-amber-600" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </button>
            )}

            {/* Dynamic Auth Section */}
            {user ? (
              /* Logged In User Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full border border-amber-500/30 hover:border-amber-500 transition-colors cursor-pointer focus:outline-none"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name || "Profile"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs md:text-sm uppercase">
                      {user?.name ? user.name.charAt(0) : <User className="w-4 h-4" />}
                    </div>
                  )}
                </button>

                {/* Profile Dropdown Content - Controlled via React State */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 p-3 theme-bg-card rounded-2xl border theme-border shadow-2xl z-[999] space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2 py-1.5 border-b theme-border">
                      <p className="text-sm font-bold theme-text-primary truncate">{user?.name || "User"}</p>
                      <p className="text-xs theme-text-secondary truncate">{user?.email}</p>
                    </div>

                    <ul className="space-y-1 text-xs">
                      <li>
                        <Link
                          href={getDashboardPath()}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2.5 py-2 px-2.5 font-semibold theme-text-primary hover:bg-amber-500/10 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-500" /> Dashboard
                        </Link>
                      </li>

                      {/* Added Profile / Edit Profile Option */}
                      <li>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2.5 py-2 px-2.5 font-semibold theme-text-primary hover:bg-amber-500/10 rounded-xl transition-colors"
                        >
                          <UserCheck className="w-4 h-4 text-amber-500" /> My Profile
                        </Link>
                      </li>

                      <li>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 py-2 px-2.5 font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              /* Guest User Auth Buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 md:px-4 py-1.5 rounded-xl border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 md:px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md hover:bg-amber-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="theme-bg-section border-t theme-border px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-10">
          
          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors py-2 px-1 border-b-2 text-xs md:text-sm ${
                    pathname === link.href
                      ? "border-amber-500 text-amber-500 font-bold"
                      : "border-transparent theme-text-secondary hover:text-amber-500"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium hidden sm:block">
            Your Local Library, Delivered Doorstep
          </div>
        </div>
      </nav>
    </header>
  );
}