"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosPublic from "@/lib/axios";
import {
  BookMarked,
  Clock,
  CheckCircle2,
  ShoppingBag,
  User,
  Loader2,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";

export default function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalBorrowed: 0,
    activeLoans: 0,
    deliveredBooks: 0,
    totalSpent: 0,
  });

  // =====================================================
  // FETCH USER DELIVERIES
  // =====================================================

  useEffect(() => {
    const fetchUserDashboardData = async () => {
      if (!user) {
        setDeliveries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await axiosPublic.get(
          "/deliveries/my-loans"
        );

        const data = res?.data;

        // Backend returns:
        // {
        //   success: true,
        //   loans: [],
        //   deliveries: []
        // }

        const list = Array.isArray(data?.deliveries)
          ? data.deliveries
          : Array.isArray(data?.loans)
          ? data.loans
          : Array.isArray(data)
          ? data
          : [];

        setDeliveries(list);

        // =================================================
        // STATS
        // =================================================

        const totalBorrowed = list.length;

        const activeLoans = list.filter(
          (item) =>
            item.status === "Pending" ||
            item.status === "Dispatched"
        ).length;

        const deliveredBooks = list.filter(
          (item) =>
            item.status === "Delivered"
        ).length;

        const totalSpent = list.reduce(
          (total, item) =>
            total +
            Number(
              item.deliveryFee || 0
            ),
          0
        );

        setStats({
          totalBorrowed,
          activeLoans,
          deliveredBooks,
          totalSpent,
        });
      } catch (error) {
        console.error(
          "Dashboard data fetch error:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load dashboard data."
        );

        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserDashboardData();
    }
  }, [user, authLoading]);

  // =====================================================
  // LOADING
  // =====================================================

  if (
    authLoading ||
    loading
  ) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />

          <p className="text-xs theme-text-secondary">
            Loading dashboard...
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
          WELCOME
      ================================================== */}

      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
            Welcome back,{" "}
            <span className="text-amber-500">
              {user?.name || "Reader"}!
            </span>
          </h1>

          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Track your borrowed books,
            active requests, payments,
            and delivery history here.
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-bold flex items-center gap-2 capitalize">
          <User className="w-4 h-4" />

          {user?.role || "user"} Account
        </div>
      </div>

      {/* =================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* TOTAL */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <BookMarked className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Total Requests
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.totalBorrowed}
            </h3>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Active Deliveries
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.activeLoans}
            </h3>
          </div>
        </div>

        {/* DELIVERED */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Delivered
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.deliveredBooks}
            </h3>
          </div>
        </div>

        {/* SPENT */}
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <DollarSign className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Total Spent
            </p>

            <h3 className="text-2xl font-bold text-emerald-500">
              ${stats.totalSpent.toFixed(2)}
            </h3>
          </div>
        </div>

      </div>

      {/* =================================================
          DELIVERY HISTORY
      ================================================== */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">

        <div className="flex items-center justify-between border-b theme-border pb-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />

            Recent Delivery History
          </h2>

          <span className="text-xs theme-text-secondary">
            {deliveries.length} request
            {deliveries.length !== 1
              ? "s"
              : ""}
          </span>
        </div>

        <div className="overflow-x-auto">

          {deliveries.length === 0 ? (
            <div className="text-center py-10 theme-text-secondary text-sm">
              <ShoppingBag className="w-8 h-8 mx-auto mb-3 opacity-50" />

              <p>
                No delivery history found.
              </p>

              <p className="text-xs mt-1">
                Your successful book requests
                will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[700px] text-left text-xs md:text-sm">

              <thead>
                <tr className="border-b theme-border theme-text-secondary">

                  <th className="py-3 px-2">
                    Book Title
                  </th>

                  <th className="py-3 px-2">
                    Transaction ID
                  </th>

                  <th className="py-3 px-2">
                    Delivery Fee
                  </th>

                  <th className="py-3 px-2">
                    Request Date
                  </th>

                  <th className="py-3 px-2">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y theme-border">

                {deliveries.map((item) => {

                  const status =
                    item.status ||
                    "Pending";

                  const transactionId =
                    item.transactionId ||
                    "N/A";

                  const fee =
                    Number(
                      item.deliveryFee || 0
                    );

                  const date =
                    item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A";

                  return (
                    <tr
                      key={
                        item._id ||
                        transactionId
                      }
                      className="hover:bg-amber-500/5 transition-colors"
                    >

                      <td className="py-4 px-2 font-semibold theme-text-primary">
                        {item.book?.title ||
                          "Unknown Book"}
                      </td>

                      <td className="py-4 px-2 font-mono text-[10px] text-amber-500">
                        {transactionId}
                      </td>

                      <td className="py-4 px-2 font-semibold text-emerald-500">
                        ${fee.toFixed(2)}
                      </td>

                      <td className="py-4 px-2 theme-text-secondary">
                        {date}
                      </td>

                      <td className="py-4 px-2">

                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                            status ===
                            "Delivered"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : status ===
                                "Dispatched"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {status}
                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          )}

        </div>
      </div>

    </div>
  );
}