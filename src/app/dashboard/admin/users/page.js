"use client";

import { useState, useEffect } from "react";
import { Users, Trash2, Loader2 } from "lucide-react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // axiosPublic-এ /api যুক্ত থাকায় শুধু /admin/users হবে
      const res = await axiosPublic.get("/admin/users");
      if (res.data) setUsers(res.data);
    } catch (error) {
      console.error("Users Fetch Error:", error);
      toast.error("Failed to load users!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
  );
}