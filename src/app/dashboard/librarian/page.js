"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, PlusCircle, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function LibrarianDashboard() {
  const [stats] = useState({
    totalBooks: 18,
    activeRentals: 5,
    pendingRequests: 3,
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
            Librarian <span className="text-amber-500">Control Panel</span>
          </h1>
          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Manage your library inventory, track borrowings, and fulfill delivery requests.
          </p>
        </div>
        <Link
          href="/dashboard/librarian/add-book"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs transition-colors shadow-md inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add New Book
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">My Listed Books</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalBooks}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Currently Rented</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.activeRentals}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Pending Requests</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.pendingRequests}</h3>
          </div>
        </div>
      </div>

      {/* Inventory & Requests Overview Table */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b theme-border pb-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" /> Recent Borrow Requests
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b theme-border theme-text-secondary">
                <th className="py-3 px-2">Book Title</th>
                <th className="py-3 px-2">Requested By</th>
                <th className="py-3 px-2">Request Date</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className="py-3 px-2 font-semibold theme-text-primary">JavaScript: The Good Parts</td>
                <td className="py-3 px-2 theme-text-secondary">Alex Johnson</td>
                <td className="py-3 px-2 theme-text-secondary">08 Aug 2026</td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Pending
                  </span>
                </td>
                <td className="py-3 px-2 text-right space-x-2">
                  <button className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] transition-colors">
                    Approve
                  </button>
                  <button className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 font-bold rounded-lg text-[10px] transition-colors">
                    Reject
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className="py-3 px-2 font-semibold theme-text-primary">Design Patterns in JS</td>
                <td className="py-3 px-2 theme-text-secondary">Sarah Connor</td>
                <td className="py-3 px-2 theme-text-secondary">05 Aug 2026</td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Approved
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-[11px] theme-text-secondary italic">In Transit</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}