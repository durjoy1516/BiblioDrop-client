"use client";

import { useState } from "react";
import { Users, BookOpen, ShieldCheck, DollarSign, UserCheck, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 142,
    totalLibrarians: 18,
    totalBooks: 320,
    totalDeliveries: 89,
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
            System <span className="text-amber-500">Administration</span>
          </h1>
          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Global view of platform users, library inventory, and platform activity.
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Super Admin
        </div>
      </div>

      {/* Global Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Total Users</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Librarians</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalLibrarians}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Total Books</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalBooks}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Completed Deliveries</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalDeliveries}</h3>
          </div>
        </div>
      </div>

      {/* Manage Users Table */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b theme-border pb-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" /> Platform User Management
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b theme-border theme-text-secondary">
                <th className="py-3 px-2">User Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className="py-3 px-2 font-semibold theme-text-primary">John Doe</td>
                <td className="py-3 px-2 theme-text-secondary">john@example.com</td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    User
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Active
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <button className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className="py-3 px-2 font-semibold theme-text-primary">City Library Owner</td>
                <td className="py-3 px-2 theme-text-secondary">library@city.org</td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Librarian
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Verified
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <button className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}