"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  Users,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import axiosPublic from "@/lib/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LibrarianDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activePendingRequests: 0,
    totalEarnings: 0,
  });

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const deliveryRes = await axiosPublic.get("/deliveries/librarian");

        const deliveryList = Array.isArray(
          deliveryRes?.data?.deliveries
        )
          ? deliveryRes.data.deliveries
          : [];

        setDeliveries(deliveryList.slice(0, 5));

        const activePendingRequests = deliveryList.filter(
          (item) =>
            item.status === "Pending" ||
            item.status === "Dispatched"
        ).length;

        const totalEarnings = deliveryList.reduce(
          (total, item) =>
            total + Number(item.deliveryFee || 0),
          0
        );

        const uniqueBooks = new Set(
          deliveryList
            .map((item) => item.book?._id)
            .filter(Boolean)
        );

        setStats({
          totalBooks: uniqueBooks.size,
          activePendingRequests,
          totalEarnings,
        });
      } catch (error) {
        console.error(
          "Error fetching librarian dashboard data:",
          error
        );

        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const chartData = [
    {
      name: "Books",
      value: stats.totalBooks || 0,
    },
    {
      name: "Pending",
      value: stats.activePendingRequests || 0,
    },
    {
      name: "Earnings",
      value: stats.totalEarnings || 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
            Librarian{" "}
            <span className="text-amber-500">
              Control Panel
            </span>
          </h1>

          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Manage your library inventory, track borrowings,
            and fulfill delivery requests.
          </p>
        </div>

        <Link
          href="/dashboard/librarian/add-book"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs transition-colors shadow-md inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Book
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <BookOpen className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              My Listed Books
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.totalBooks}
            </h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Active Requests
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              {stats.activePendingRequests}
            </h3>
          </div>
        </div>

        <div className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs theme-text-secondary font-medium">
              Total Earnings
            </p>

            <h3 className="text-2xl font-bold theme-text-primary">
              ${stats.totalEarnings.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-xl">
        <h2 className="text-lg font-bold theme-text-primary mb-4">
          Inventory & Delivery Analytics
        </h2>

        <div className="h-64 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#64748b"
              />

              <YAxis stroke="#64748b" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "10px",
                }}
              />

              <Bar
                dataKey="value"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Borrow Requests */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b theme-border pb-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Recent Borrow Requests
          </h2>

          <Link
            href="/dashboard/librarian/deliveries"
            className="text-xs text-amber-500 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b theme-border theme-text-secondary">
                <th className="py-3 px-2">Book Title</th>
                <th className="py-3 px-2">Requested By</th>
                <th className="py-3 px-2">Delivery Fee</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y theme-border">
              {deliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center theme-text-secondary"
                  >
                    No recent borrow requests found.
                  </td>
                </tr>
              ) : (
                deliveries.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-amber-500/5 transition-colors"
                  >
                    <td className="py-3 px-2 font-semibold theme-text-primary">
                      {item.book?.title || "Unknown Book"}
                    </td>

                    <td className="py-3 px-2 theme-text-secondary">
                      {item.user?.email ||
                        item.user?.name ||
                        "Unknown User"}
                    </td>

                    <td className="py-3 px-2 theme-text-primary">
                      $
                      {Number(
                        item.deliveryFee || 0
                      ).toFixed(2)}
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
                        {item.status || "Pending"}
                      </span>
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