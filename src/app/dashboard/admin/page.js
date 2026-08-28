"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  ShieldCheck,
  DollarSign,
  UserCheck,
  Trash2,
  Loader2,
  PieChart as PieIcon,
  RefreshCw,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLibrarians: 0,
    totalBooks: 0,
    totalDeliveries: 0,
    totalRevenue: 0,
  });

  const [users, setUsers] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = [
    "#f59e0b",
    "#3b82f6",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [statsRes, usersRes, categoryRes] =
        await Promise.all([
          axiosPublic.get("/admin/stats"),
          axiosPublic.get("/admin/users"),
          axiosPublic.get("/admin/category-stats"),
        ]);

      // =================================================
      // STATS
      // Backend:
      // {
      //   success: true,
      //   stats: {...},
      //   categoryStats: [...]
      // }
      // =================================================

      if (statsRes?.data?.success) {
        setStats(
          statsRes.data.stats || {
            totalUsers: 0,
            totalLibrarians: 0,
            totalBooks: 0,
            totalDeliveries: 0,
            totalRevenue: 0,
          }
        );
      }

      // =================================================
      // USERS
      // Backend:
      // {
      //   success: true,
      //   users: [...]
      // }
      // =================================================

      if (usersRes?.data?.success) {
        setUsers(
          Array.isArray(usersRes.data.users)
            ? usersRes.data.users
            : []
        );
      }

      // =================================================
      // CATEGORY STATS
      // Backend:
      // {
      //   success: true,
      //   categoryStats: [...]
      // }
      // =================================================

      if (categoryRes?.data?.success) {
        setCategoryStats(
          Array.isArray(categoryRes.data.categoryStats)
            ? categoryRes.data.categoryStats
            : []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Dashboard data failed to load!"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (userId) => {
    if (!userId) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );

    if (!confirmed) return;

    try {
      await axiosPublic.delete(
        `/admin/users/${userId}`
      );

      toast.success(
        "User deleted successfully!"
      );

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user._id !== userId
        )
      );

      // Refresh stats because total users changed
      const statsRes = await axiosPublic.get(
        "/admin/stats"
      );

      if (statsRes?.data?.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete user!"
      );
    }
  };

  // =====================================================
  // CHANGE USER ROLE
  // =====================================================

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    if (!userId || !newRole) return;

    try {
      await axiosPublic.patch(
        `/admin/users/${userId}/role`,
        {
          role: newRole,
        }
      );

      toast.success(
        `Role updated to ${newRole}`
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

      // Refresh stats because librarian/admin count may change
      const statsRes = await axiosPublic.get(
        "/admin/stats"
      );

      if (statsRes?.data?.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error(
        "Role update error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update role!"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />

          <p className="text-xs theme-text-secondary">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          WELCOME BANNER
      ================================================== */}

      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
              System{" "}
              <span className="text-amber-500">
                Administration
              </span>
            </h1>

            <p className="text-xs md:text-sm theme-text-secondary mt-1">
              Global view of platform users,
              library inventory, transactions,
              and platform activity.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                fetchDashboardData(true)
              }
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border theme-border theme-text-primary hover:bg-amber-500/10 transition-colors text-xs font-semibold disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Super Admin
            </div>

          </div>
        </div>
      </div>

      {/* =================================================
          OVERVIEW STATS
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* USERS */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">

          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Users className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Total Users
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.totalUsers || 0}
            </h3>
          </div>

        </div>

        {/* BOOKS */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">

          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <BookOpen className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Total Books
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.totalBooks || 0}
            </h3>
          </div>

        </div>

        {/* DELIVERIES */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">

          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <UserCheck className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Total Deliveries
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.totalDeliveries || 0}
            </h3>
          </div>

        </div>

        {/* REVENUE */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">

          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <DollarSign className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Total Revenue
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              ${Number(stats.totalRevenue || 0).toFixed(2)}
            </h3>
          </div>

        </div>

      </div>

      {/* =================================================
          CATEGORY CHART
      ================================================== */}

      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-xl">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-500" />

              Books Distribution by Category
            </h2>

            <p className="text-xs theme-text-secondary mt-1">
              Overview of books available in
              different categories.
            </p>
          </div>

        </div>

        {categoryStats.length === 0 ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-sm theme-text-secondary">
              No category data available.
            </p>
          </div>
        ) : (
          <div className="h-72 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryStats.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* =================================================
          USER MANAGEMENT
      ================================================== */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b theme-border pb-4">

          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />

            Platform User Management
          </h2>

          <span className="text-xs theme-text-secondary font-medium">
            Total Users: {users.length}
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left text-xs md:text-sm">

            <thead>

              <tr className="border-b theme-border theme-text-secondary">

                <th className="py-3 px-2">
                  User Name
                </th>

                <th className="py-3 px-2">
                  Email
                </th>

                <th className="py-3 px-2">
                  Role
                </th>

                <th className="py-3 px-2">
                  Change Role
                </th>

                <th className="py-3 px-2 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y theme-border">

              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center theme-text-secondary"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (

                  <tr
                    key={
                      user._id ||
                      user.email
                    }
                    className="hover:bg-amber-500/5 transition-colors"
                  >

                    {/* NAME */}
                    <td className="py-3 px-2 font-semibold theme-text-primary">
                      {user.name || "N/A"}
                    </td>

                    {/* EMAIL */}
                    <td className="py-3 px-2 theme-text-secondary">
                      {user.email || "N/A"}
                    </td>

                    {/* ROLE */}
                    <td className="py-3 px-2">

                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                          user.role ===
                          "admin"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            : user.role ===
                              "librarian"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }`}
                      >
                        {(
                          user.role ||
                          "user"
                        ).toUpperCase()}
                      </span>

                    </td>

                    {/* ROLE SELECT */}
                    <td className="py-3 px-2">

                      <select
                        value={
                          user.role ||
                          "user"
                        }
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value
                          )
                        }
                        disabled={
                          !user._id
                        }
                        className="bg-transparent border theme-border rounded-lg px-2 py-1 text-xs theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      >

                        <option
                          value="user"
                          className="bg-slate-900 text-white"
                        >
                          User
                        </option>

                        <option
                          value="librarian"
                          className="bg-slate-900 text-white"
                        >
                          Librarian
                        </option>

                        <option
                          value="admin"
                          className="bg-slate-900 text-white"
                        >
                          Admin
                        </option>

                      </select>

                    </td>

                    {/* DELETE */}
                    <td className="py-3 px-2 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteUser(
                            user._id
                          )
                        }
                        disabled={
                          !user._id
                        }
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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