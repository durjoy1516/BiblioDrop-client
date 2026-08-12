"use client";

import { useState, useEffect } from "react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";
import { Truck, Loader2 } from "lucide-react";

export default function ManageDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await axiosPublic.get("/librarian/deliveries");
      if (res.data) setDeliveries(res.data);
    } catch (error) {
      toast.error("Failed to load deliveries!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      await axiosPublic.patch(`/librarian/deliveries/${deliveryId}/status`, { status: newStatus });
      toast.success(`Delivery status updated to ${newStatus}`);
      setDeliveries((prev) =>
        prev.map((d) => (d._id === deliveryId ? { ...d, status: newStatus } : d))
      );
    } catch (error) {
      toast.error("Failed to update status!");
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
      <h1 className="text-lg font-bold theme-text-primary flex items-center gap-2">
        <Truck className="w-5 h-5 text-amber-500" /> Manage Delivery Requests
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b theme-border theme-text-secondary">
              <th className="py-3 px-2">Book Title</th>
              <th className="py-3 px-2">Client Email</th>
              <th className="py-3 px-2">Delivery Fee</th>
              <th className="py-3 px-2">Current Status</th>
              <th className="py-3 px-2 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y theme-border">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center theme-text-secondary">
                  No active delivery requests.
                </td>
              </tr>
            ) : (
              deliveries.map((item) => (
                <tr key={item._id} className="hover:bg-amber-500/5 transition-colors">
                  <td className="py-3 px-2 font-semibold theme-text-primary">{item.bookId?.title || "N/A"}</td>
                  <td className="py-3 px-2 theme-text-secondary">{item.userEmail}</td>
                  <td className="py-3 px-2 theme-text-primary">${item.deliveryFee}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                        item.status === "Delivered"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : item.status === "Dispatched"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className="bg-transparent border theme-border rounded-lg px-2 py-1 text-xs theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                      <option value="Dispatched" className="bg-slate-900 text-white">Dispatched</option>
                      <option value="Delivered" className="bg-slate-900 text-white">Delivered</option>
                    </select>
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