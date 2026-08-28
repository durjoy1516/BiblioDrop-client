"use client";

import { useState, useEffect } from "react";

import {
  Users,
  Trash2,
  Loader2,
  RefreshCw,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res =
        await axiosPublic.get("/admin/users");

      const list =
        Array.isArray(res?.data?.users)
          ? res.data.users
          : Array.isArray(res?.data)
          ? res.data
          : [];

      setUsers(list);
    } catch (error) {
      console.error(
        "Users Fetch Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load users!"
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // CHANGE ROLE
  // =====================================================

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    if (!userId || !newRole) return;

    try {
      setActionId(userId);

      const res =
        await axiosPublic.patch(
          `/admin/users/${userId}/role`,
          {
            role: newRole,
          }
        );

      const updatedUser =
        res?.data?.user ||
        res?.data;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                ...(updatedUser || {}),
                role: newRole,
              }
            : user
        )
      );

      toast.success(
        `Role updated to ${newRole}!`
      );
    } catch (error) {
      console.error(
        "Role update error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update role!"
      );
    } finally {
      setActionId(null);
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (
    userId
  ) => {
    if (!userId) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );

    if (!confirmed) return;

    try {
      setActionId(userId);

      await axiosPublic.delete(
        `/admin/users/${userId}`
      );

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== userId
        )
      );

      toast.success(
        "User deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete user!"
      );
    } finally {
      setActionId(null);
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
            Loading users...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h1 className="text-xl md:text-2xl font-bold theme-text-primary flex items-center gap-2">

              <Users className="w-6 h-6 text-amber-500" />

              User Management

            </h1>

            <p className="text-xs theme-text-secondary mt-1">
              Manage platform users and their
              roles.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Users */}

        <div className="theme-bg-card border theme-border rounded-2xl p-4">

          <div className="flex items-center gap-3">

            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <Users className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs theme-text-secondary">
                Total Users
              </p>

              <p className="text-xl font-bold theme-text-primary">
                {users.length}
              </p>

            </div>

          </div>

        </div>

        {/* Librarians */}

        <div className="theme-bg-card border theme-border rounded-2xl p-4">

          <div className="flex items-center gap-3">

            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs theme-text-secondary">
                Librarians
              </p>

              <p className="text-xl font-bold theme-text-primary">
                {
                  users.filter(
                    (user) =>
                      user.role ===
                      "librarian"
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

        {/* Admins */}

        <div className="theme-bg-card border theme-border rounded-2xl p-4">

          <div className="flex items-center gap-3">

            <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs theme-text-secondary">
                Admins
              </p>

              <p className="text-xl font-bold theme-text-primary">
                {
                  users.filter(
                    (user) =>
                      user.role ===
                      "admin"
                  ).length
                }
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Users Table */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left text-xs md:text-sm">

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
                users.map((user) => {

                  const isUpdating =
                    actionId === user._id;

                  return (
                    <tr
                      key={
                        user._id ||
                        user.email
                      }
                      className="hover:bg-amber-500/5 transition-colors"
                    >

                      {/* Name */}

                      <td className="py-4 px-2 font-semibold theme-text-primary">
                        {user.name ||
                          "N/A"}
                      </td>

                      {/* Email */}

                      <td className="py-4 px-2 theme-text-secondary">
                        {user.email ||
                          "N/A"}
                      </td>

                      {/* Role */}

                      <td className="py-4 px-2">

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

                      {/* Change Role */}

                      <td className="py-4 px-2">

                        <select
                          value={
                            user.role ||
                            "user"
                          }
                          disabled={
                            isUpdating
                          }
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value
                            )
                          }
                          className="bg-transparent border theme-border rounded-lg px-2 py-1.5 text-xs theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
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

                      {/* Delete */}

                      <td className="py-4 px-2 text-right">

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            handleDeleteUser(
                              user._id
                            )
                          }
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete User"
                        >

                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}

                        </button>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}