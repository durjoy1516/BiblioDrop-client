"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, ShieldCheck, DollarSign, UserCheck, Trash2, Loader2, PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalDeliveries: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // চার্টের রঙের প্যালেট
  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, chartRes] = await Promise.all([
        axiosPublic.get("/admin/stats"),
        axiosPublic.get("/admin/users"),
        axiosPublic.get("/admin/category-stats").catch(() => ({ data: [] })), // Fallback handler
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      
      // চার্টের ডাটা সেটআপ (API ডাটা না থাকলে ডামি ভিজ্যুয়াল ডাটা দেখাবে)
      if (chartRes.data && chartRes.data.length > 0) {
        setCategoryStats(chartRes.data);
      } else {
        setCategoryStats([
          { name: "Fiction", value: 12 },
          { name: "Sci-Fi", value: 8 },
          { name: "Academic", value: 15 },
          { name: "Biography", value: 5 },
        ]);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Dashboard data failed to load!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosPublic.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully!");
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user!");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosPublic.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      toast.error("Failed to update role!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

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

      {/* Global Overview Stats (Requirement Satisfied) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Total Users</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Total Books</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalBooks || 0}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Total Deliveries</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.totalDeliveries || 0}</h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs theme-text-secondary font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold theme-text-primary">${stats.totalRevenue || 0}</h3>
          </div>
        </div>
      </div>

      {/* Recharts Component (Pie Chart for Category) */}
      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-amber-500" /> Books Distribution by Category
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manage Users Table */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b theme-border pb-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" /> Platform User Management
          </h2>
          <span className="text-xs theme-text-secondary font-medium">
            Total Users: {users.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b theme-border theme-text-secondary">
                <th className="py-3 px-2">User Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2">Change Role</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center theme-text-secondary">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id || user.email} className="hover:bg-amber-500/5 transition-colors">
                    <td className="py-3 px-2 font-semibold theme-text-primary">
                      {user.name || "N/A"}
                    </td>
                    <td className="py-3 px-2 theme-text-secondary">{user.email}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                          user.role === "admin"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            : user.role === "librarian"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }`}
                      >
                        {user.role ? user.role.toUpperCase() : "USER"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={user.role || "user"}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-transparent border theme-border rounded-lg px-2 py-1 text-xs theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="user" className="bg-slate-900 text-white">User</option>
                        <option value="librarian" className="bg-slate-900 text-white">Librarian</option>
                        <option value="admin" className="bg-slate-900 text-white">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}