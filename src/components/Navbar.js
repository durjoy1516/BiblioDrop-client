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
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Books", href: "/books" },
    { name: "Dashboard", href: "/dashboard/user" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Header Bar */}
      <div className="custom-banner-bg px-4 lg:px-8 py-3 shadow-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-lg text-primary-content font-bold transition-transform group-hover:scale-105">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight custom-text-main">
              Biblio<span className="text-amber-500">Drop</span>
            </span>
          </Link>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books, authors, categories..."
                className="w-full py-2 pl-4 pr-10 text-sm rounded-md text-slate-800 bg-white border-2 border-amber-500 focus:outline-none"
              />
              <button className="absolute right-0 top-0 bottom-0 bg-amber-500 text-slate-900 font-bold px-3 rounded-r-md flex items-center hover:opacity-90">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Actions & Theme Switch */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="btn btn-sm btn-ghost btn-circle text-amber-500 hover:bg-amber-500/20"
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
              className="btn btn-sm btn-outline border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-900 font-semibold"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-sm bg-amber-500 text-slate-950 font-bold shadow-md hover:bg-amber-400 border-none"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="custom-subnav-bg border-t border-amber-500/10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-11">
          
          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors py-2 px-1 border-b-2 font-semibold ${
                    pathname === link.href
                      ? "border-amber-500 text-amber-500 font-bold"
                      : "border-transparent custom-text-muted hover:text-amber-500"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Dropdown */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm text-amber-500">
              <Menu className="w-5 h-5" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-2 z-[1] p-2 shadow custom-banner-bg custom-text-main rounded-box w-52 border border-amber-500/20"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={pathname === link.href ? "text-amber-500 font-bold" : ""}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-amber-500/90 font-medium hidden sm:block">
            Your Local Library, Delivered Doorstep
          </div>
        </div>
      </nav>
    </header>
  );
}