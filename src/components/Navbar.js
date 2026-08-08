"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Moon, Sun, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Books", href: "/books" },
    { name: "Dashboard", href: "/dashboard/user" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Header Bar */}
      <div className="theme-bg-card border-b theme-border px-4 lg:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-amber-500 rounded-lg text-slate-950 font-bold transition-transform group-hover:scale-105">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight theme-text-primary">
              Biblio<span className="text-amber-500">Drop</span>
            </span>
          </Link>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form action="/books" className="relative w-full">
              <input
                type="text"
                name="search"
                placeholder="Search books, authors, categories..."
                className="w-full py-2 pl-4 pr-10 text-sm rounded-xl theme-text-primary bg-amber-500/5 border theme-border focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-amber-500 text-slate-950 font-bold px-3.5 rounded-r-xl flex items-center hover:bg-amber-400 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Actions & Theme Switch */}
          <div className="flex items-center gap-3">
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

            {/* Auth Buttons */}
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-xl border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md hover:bg-amber-400 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="theme-bg-section border-t theme-border px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-11">
          
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

          {/* Mobile Menu Dropdown */}
          <div className="dropdown lg:hidden relative">
            <div tabIndex={0} role="button" className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 cursor-pointer">
              <Menu className="w-5 h-5" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-2 z-[50] p-2 shadow-xl theme-bg-card rounded-xl w-52 border theme-border"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`py-2 px-3 rounded-lg text-xs font-medium ${
                      pathname === link.href ? "bg-amber-500 text-slate-950 font-bold" : "theme-text-primary hover:bg-amber-500/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium hidden sm:block">
            Your Local Library, Delivered Doorstep
          </div>
        </div>
      </nav>
    </header>
  );
}