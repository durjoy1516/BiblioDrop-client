"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosPublic from "@/lib/axios";
import StatCards from "@/components/dashboard/StatCards";
import Charts from "@/components/dashboard/Charts";
import {
  ShoppingBag,
  User,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalBorrowed: 0,
    activeLoans: 0,
    returnedBooks: 0,
  });

  const fetchUserDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      const res = await axiosPublic.get("/deliveries/my-loans");

      // Support different backend response structures
      const data = res.data;

      let list = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.deliveries)) {
        list = data.deliveries;
      } else if (Array.isArray(data?.loans)) {
        list = data.loans;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      }

      setDeliveries(list);

      // Calculate dashboard statistics
      const totalBorrowed = list.length;

      const activeLoans = list.filter((item) => {
        const status = item?.status?.toLowerCase();

        return (
          status === "pending" ||
          status === "dispatched" ||
          status === "pending delivery"
        );
      }).length;

      const returnedBooks = list.filter((item) => {
        const status = item?.status?.toLowerCase();

        return (
          status === "delivered" ||
          status === "returned"
        );
      }).length;

      setStats({
        totalBorrowed,
        activeLoans,
        returnedBooks,
      });
    } catch (err) {
      console.error(
        "User dashboard data fetch error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load your dashboard data."
      );

      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    fetchUserDashboardData();
  }, [user, authLoading]);

  // Authentication loading
  if (authLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Dashboard data loading
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm theme-text-secondary">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* =====================================================
          WELCOME BANNER
      ====================================================== */}
      <section className="theme-bg-card border theme-border p-6 md:p-7 rounded-3xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              Reader Dashboard
            </p>

            <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
              Welcome back,{" "}
              <span className="text-amber-500">
                {user?.name || "Reader"}!
              </span>
            </h1>

            <p className="text-xs md:text-sm theme-text-secondary mt-2 max-w-xl">
              Track your borrowed books, active delivery
              requests, and reading activity from one place.
            </p>
          </div>

          <div className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-bold flex items-center gap-2 capitalize">
            <User className="w-4 h-4" />
            {user?.role || "user"} Account
          </div>
        </div>
      </section>

      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}
      {error && (
        <div className="theme-bg-card border border-rose-500/30 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />

              <div>
                <p className="text-sm font-semibold text-rose-500">
                  Something went wrong
                </p>

                <p className="text-xs theme-text-secondary mt-0.5">
                  {error}
                </p>
              </div>
            </div>

            <button
              onClick={fetchUserDashboardData}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ====================================================== */}
      <section>
        <StatCards
          stats={stats}
          role={user?.role || "user"}
        />
      </section>

      {/* =====================================================
          ANALYTICS
      ====================================================== */}
      <section>
        <Charts deliveries={deliveries} />
      </section>

      {/* =====================================================
          DELIVERY / BORROW HISTORY
      ====================================================== */}
      <section className="theme-bg-card border theme-border rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b theme-border pb-4">
          <div>
            <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              Delivery History
            </h2>

            <p className="text-xs theme-text-secondary mt-1">
              Your recent book delivery requests and their current status.
            </p>
          </div>

          <span className="text-xs theme-text-secondary">
            {deliveries.length}{" "}
            {deliveries.length === 1
              ? "request"
              : "requests"}
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          {deliveries.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto text-amber-500/40 mb-3" />

              <p className="text-sm font-semibold theme-text-primary">
                No delivery history yet
              </p>

              <p className="text-xs theme-text-secondary mt-1">
                Your book delivery requests will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[700px] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b theme-border theme-text-secondary">
                  <th className="py-3 px-3 font-semibold">
                    Book Title
                  </th>

                  <th className="py-3 px-3 font-semibold">
                    Transaction ID
                  </th>

                  <th className="py-3 px-3 font-semibold">
                    Delivery Fee
                  </th>

                  <th className="py-3 px-3 font-semibold">
                    Request Date
                  </th>

                  <th className="py-3 px-3 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y theme-border">
                {deliveries.map((item, index) => {
                  const status =
                    item?.status || "Pending";

                  const normalizedStatus =
                    status.toLowerCase();

                  const transactionId =
                    item?.transactionId ||
                    item?.transaction_id ||
                    item?.paymentId ||
                    "N/A";

                  const fee =
                    item?.deliveryFee ??
                    item?.amount ??
                    0;

                  const createdAt =
                    item?.createdAt ||
                    item?.created_at ||
                    item?.requestDate;

                  let formattedDate = "N/A";

                  if (createdAt) {
                    const date = new Date(createdAt);

                    if (!Number.isNaN(date.getTime())) {
                      formattedDate =
                        date.toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        );
                    }
                  }

                  let statusClass =
                    "bg-amber-500/10 text-amber-500 border-amber-500/20";

                  if (
                    normalizedStatus === "delivered" ||
                    normalizedStatus === "returned"
                  ) {
                    statusClass =
                      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                  } else if (
                    normalizedStatus === "dispatched"
                  ) {
                    statusClass =
                      "bg-blue-500/10 text-blue-500 border-blue-500/20";
                  } else if (
                    normalizedStatus === "cancelled" ||
                    normalizedStatus === "canceled" ||
                    normalizedStatus === "rejected"
                  ) {
                    statusClass =
                      "bg-rose-500/10 text-rose-500 border-rose-500/20";
                  }

                  return (
                    <tr
                      key={
                        item?._id ||
                        item?.id ||
                        transactionId ||
                        index
                      }
                      className="hover:bg-amber-500/5 transition-colors"
                    >
                      {/* Book */}
                      <td className="py-4 px-3">
                        <div className="font-semibold theme-text-primary">
                          {item?.book?.title ||
                            item?.bookTitle ||
                            item?.title ||
                            "Unknown Book"}
                        </div>
                      </td>

                      {/* Transaction */}
                      <td className="py-4 px-3">
                        <span className="font-mono text-[11px] theme-text-secondary">
                          {transactionId}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="py-4 px-3 theme-text-secondary">
                        ${Number(fee).toFixed(2)}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-3 theme-text-secondary whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${statusClass}`}
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
      </section>
    </div>
  );
}