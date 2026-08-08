"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-content border-t border-white/10 mt-auto">
      <div className="footer p-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-3">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="p-2 bg-primary rounded-lg text-primary-content">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-white font-extrabold">
              Biblio<span className="text-primary">Drop</span>
            </span>
          </div>
          <p className="text-sm text-gray-300 max-w-xs leading-relaxed">
            Connecting readers with local libraries & independent book owners. Doorstep delivery made simple.
          </p>
        </aside>

        <nav className="flex flex-col space-y-2">
          <h6 className="footer-title text-primary font-bold opacity-100">Quick Links</h6>
          <Link href="/" className="link link-hover text-gray-300 hover:text-primary">Home</Link>
          <Link href="/books" className="link link-hover text-gray-300 hover:text-primary">Browse Books</Link>
          <Link href="/dashboard/user" className="link link-hover text-gray-300 hover:text-primary">Dashboard</Link>
        </nav>

        <nav className="flex flex-col space-y-2">
          <h6 className="footer-title text-primary font-bold opacity-100">Legal</h6>
          <Link href="#" className="link link-hover text-gray-300 hover:text-primary">Privacy Policy</Link>
          <Link href="#" className="link link-hover text-gray-300 hover:text-primary">Terms of Service</Link>
        </nav>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
          <h6 className="footer-title text-primary font-bold opacity-100">Newsletter</h6>
          <p className="text-xs text-gray-300">Subscribe to get updates on new book arrivals.</p>
          <div className="join w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-sm border-0 join-item w-full text-slate-800 bg-white focus:outline-none"
            />
            <button className="btn btn-sm btn-primary text-primary-content font-bold join-item">
              Join
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Bar with Updated X Logo */}
      <div className="bg-secondary/90 py-4 px-4 border-t border-white/10 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} BiblioDrop. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
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