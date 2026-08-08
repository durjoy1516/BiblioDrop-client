"use client";

import { useState, useEffect } from "react";
import { BookMarked, Clock, CheckCircle2, ShoppingBag, User } from "lucide-react";

export default function UserDashboard() {
  const [stats, setStats] = useState({
    totalBorrowed: 4,
    activeLoans: 2,
    returnedBooks: 2,
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
            Welcome back, <span className="text-amber-500">Reader!</span>
          </h1>
          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Track your borrowed books, active requests, and account summary here.
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-bold flex items-center gap-2">
          <User className="w-4 h-4" /> Member Account
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Total Borrowed</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalBorrowed}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Active Loans</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.activeLoans}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Returned</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.returnedBooks}</h3>
          </div>
        </div>
      </div>

      {/* Borrowed Books List Table */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b theme-border pb-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" /> Recent Borrow History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b theme-border theme-text-secondary">
                <th className="py-3 px-2">Book Title</th>
                <th className="py-3 px-2">Borrow Date</th>
                <th className="py-3 px-2">Return Date</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className="py-3 px-2 font-semibold theme-text-primary">The Pragmatic Programmer</td>
                <td className="py-3 px-2 theme-text-secondary">12 Apr 2026</td>
                <td className="py-3 px-2 theme-text-secondary">26 Apr 2026</td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className="py-3 px-2 font-semibold theme-text-primary">Clean Code</td>
                <td className="py-3 px-2 theme-text-secondary">01 Mar 2026</td>
                <td className="py-3 px-2 theme-text-secondary">15 Mar 2026</td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Returned
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}