"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosPublic from "@/lib/axios";
import { BookMarked, Clock, CheckCircle2, ShoppingBag, User, Loader2 } from "lucide-react";

export default function UserDashboardPage() {
  const { user } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    activeLoans: 0,
    returnedBooks: 0,
  });

  useEffect(() => {
    const fetchUserDashboardData = async () => {
      try {
        setLoading(true);
        // ব্যাকএন্ডের /deliveries/my-loans এন্ডপয়েন্টে রিকোয়েস্ট
        const res = await axiosPublic.get("/deliveries/my-loans");
        const list = Array.isArray(res.data) ? res.data : [];

        setDeliveries(list);

        // Status অনুযায়ী Statistics হিসাব করা
        const total = list.length;
        const active = list.filter(
          (item) => item.status === "Pending" || item.status === "Dispatched"
        ).length;
        const returned = list.filter((item) => item.status === "Delivered").length;

        setStats({
          totalBorrowed: total,
          activeLoans: active,
          returnedBooks: returned,
        });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

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
            Welcome back, <span className="text-amber-500">{user?.name || "Reader"}!</span>
          </h1>
          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Track your borrowed books, active requests, and account summary here.
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-bold flex items-center gap-2 capitalize">
          <User className="w-4 h-4" /> {user?.role || "user"} Account
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
            <p className="text-xs theme-text-secondary font-medium">Returned / Delivered</p>
            <h3 className="text-2xl font-bold theme-text-primary">{stats.returnedBooks}</h3>
          </div>
        </div>
      </div>

      {/* Borrow History Table */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b theme-border pb-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" /> Recent Borrow History
          </h2>
        </div>

        <div className="overflow-x-auto">
          {deliveries.length === 0 ? (
            <div className="text-center py-8 theme-text-secondary text-sm">
              No borrow history found for this account.
            </div>
          ) : (
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b theme-border theme-text-secondary">
                  <th className="py-3 px-2">Book Title</th>
                  <th className="py-3 px-2">Transaction ID</th>
                  <th className="py-3 px-2">Delivery Fee</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {deliveries.map((item) => (
                  <tr key={item._id} className="hover:bg-amber-500/5 transition-colors">
                    <td className="py-3 px-2 font-semibold theme-text-primary">
                      {item.book?.title || "Unknown Book"}
                    </td>
                    <td className="py-3 px-2 font-mono text-xs theme-text-secondary">
                      {item.transactionId}
                    </td>
                    <td className="py-3 px-2 theme-text-secondary">
                      ${item.deliveryFee}
                    </td>
                    <td className="py-3 px-2 theme-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                          item.status === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : item.status === "Dispatched"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}