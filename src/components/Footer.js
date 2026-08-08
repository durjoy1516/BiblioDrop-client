"use client";

import Link from "next/link";
import { BookOpen, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="theme-bg-section theme-text-primary border-t theme-border mt-auto">
      <div className="max-w-7xl mx-auto p-8 md:p-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="p-2 bg-amber-500 rounded-lg text-slate-950">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="theme-text-primary font-extrabold">
              Biblio<span className="text-amber-500">Drop</span>
            </span>
          </div>
          <p className="text-xs theme-text-secondary max-w-xs leading-relaxed">
            Connecting readers with local libraries & independent book owners. Doorstep delivery made simple.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h6 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Quick Links
          </h6>
          <Link href="/" className="text-xs theme-text-secondary hover:text-amber-500 transition-colors">
            Home
          </Link>
          <Link href="/books" className="text-xs theme-text-secondary hover:text-amber-500 transition-colors">
            Browse Books
          </Link>
          <Link href="/dashboard/user" className="text-xs theme-text-secondary hover:text-amber-500 transition-colors">
            Dashboard
          </Link>
        </div>

        {/* Legal */}
        <div className="flex flex-col space-y-2">
          <h6 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Legal
          </h6>
          <Link href="#" className="text-xs theme-text-secondary hover:text-amber-500 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs theme-text-secondary hover:text-amber-500 transition-colors">
            Terms of Service
          </Link>
        </div>

        {/* Newsletter */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <h6 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Newsletter
          </h6>
          <p className="text-xs theme-text-secondary">
            Subscribe to get updates on new book arrivals.
          </p>
          <div className="flex items-center gap-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-xl border theme-border bg-amber-500/5 text-xs theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Bar */}
      <div className="theme-bg-card py-4 px-4 border-t theme-border text-xs theme-text-secondary">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} BiblioDrop. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-500 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}