"use client";

import { useState, useEffect } from "react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";
import { Truck, Loader2, RefreshCw } from "lucide-react";

export default function ManageDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // FETCH LIBRARIAN DELIVERIES
  // Backend: GET /deliveries/librarian
  // =====================================================
  const fetchDeliveries = async () => {
    try {
      setLoading(true);

      const res = await axiosPublic.get("/deliveries/librarian");

      const data = res?.data;

      // Backend returns:
      // { success: true, deliveries: [...] }
      const list = Array.isArray(data?.deliveries)
        ? data.deliveries
        : Array.isArray(data)
        ? data
        : [];

      setDeliveries(list);
    } catch (error) {
      console.error("Failed to load deliveries:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load delivery requests!"
      );

      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // =====================================================
  // UPDATE DELIVERY STATUS
  // Backend: PATCH /deliveries/:id/status
  // =====================================================
  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      setUpdatingId(deliveryId);

      const res = await axiosPublic.patch(
        `/deliveries/${deliveryId}/status`,
        {
          status: newStatus,
        }
      );

      const updatedDelivery = res?.data?.delivery;

      // If backend returns updated delivery
      if (updatedDelivery) {
        setDeliveries((prev) =>
          prev.map((delivery) =>
            delivery._id === deliveryId
              ? updatedDelivery
              : delivery
          )
        );
      } else {
        // Fallback
        setDeliveries((prev) =>
          prev.map((delivery) =>
            delivery._id === deliveryId
              ? {
                  ...delivery,
                  status: newStatus,
                }
              : delivery
          )
        );
      }

      toast.success(
        `Delivery status updated to ${newStatus}`
      );
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update delivery status!"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <h1 className="text-xl md:text-2xl font-bold theme-text-primary flex items-center gap-2">
              <Truck className="w-6 h-6 text-amber-500" />
              Manage Delivery Requests
            </h1>

            <p className="text-xs theme-text-secondary mt-1">
              Review and update the delivery status of your books.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDeliveries}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">

            <thead>
              <tr className="border-b theme-border theme-text-secondary">
                <th className="py-3 px-2">
                  Book Title
                </th>

                <th className="py-3 px-2">
                  Client
                </th>

                <th className="py-3 px-2">
                  Delivery Fee
                </th>

                <th className="py-3 px-2">
                  Current Status
                </th>

                <th className="py-3 px-2 text-right">
                  Update Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y theme-border">

              {deliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center theme-text-secondary"
                  >
                    No delivery requests found.
                  </td>
                </tr>
              ) : (
                deliveries.map((item) => {

                  const isUpdating =
                    updatingId === item._id;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-amber-500/5 transition-colors"
                    >

                      {/* Book */}
                      <td className="py-4 px-2">
                        <div className="font-semibold theme-text-primary">
                          {item.book?.title ||
                            "Unknown Book"}
                        </div>

                        {item.book?.author && (
                          <div className="text-[10px] theme-text-secondary mt-0.5">
                            by {item.book.author}
                          </div>
                        )}
                      </td>

                      {/* Client */}
                      <td className="py-4 px-2 theme-text-secondary">
                        <div>
                          {item.user?.name ||
                            "Unknown User"}
                        </div>

                        <div className="text-[10px] mt-0.5">
                          {item.user?.email || "N/A"}
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="py-4 px-2 font-semibold theme-text-primary">
                        ${Number(item.deliveryFee || 0).toFixed(2)}
                      </td>

                      {/* Current Status */}
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${
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

                      {/* Update */}
                      <td className="py-4 px-2 text-right">

                        <select
                          value={item.status}
                          disabled={
                            isUpdating ||
                            item.status === "Delivered"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              item._id,
                              e.target.value
                            )
                          }
                          className="bg-transparent border theme-border rounded-lg px-2 py-1.5 text-xs theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option
                            value="Pending"
                            className="bg-slate-900 text-white"
                          >
                            Pending
                          </option>

                          <option
                            value="Dispatched"
                            className="bg-slate-900 text-white"
                          >
                            Dispatched
                          </option>

                          <option
                            value="Delivered"
                            className="bg-slate-900 text-white"
                          >
                            Delivered
                          </option>
                        </select>

                        {isUpdating && (
                          <Loader2 className="inline-block ml-2 w-3.5 h-3.5 animate-spin text-amber-500" />
                        )}

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