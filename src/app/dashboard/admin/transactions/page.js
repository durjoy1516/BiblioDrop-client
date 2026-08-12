"use client";

import { useState, useEffect } from "react";
import { DollarSign, Loader2 } from "lucide-react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get("/admin/transactions");
        if (res.data) setTransactions(res.data);
      } catch (error) {
        toast.error("Failed to load transactions!");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold theme-text-primary flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-amber-500" /> Platform Payment Transactions
      </h1>

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b theme-border theme-text-secondary">
              <th className="py-3 px-2">Transaction ID</th>
              <th className="py-3 px-2">User Email</th>
              <th className="py-3 px-2">Librarian Email</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y theme-border">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center theme-text-secondary">
                  No payment transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id || tx.transactionId} className="hover:bg-amber-500/5 transition-colors">
                  <td className="py-3 px-2 font-mono text-amber-500 font-bold">{tx.transactionId}</td>
                  <td className="py-3 px-2 theme-text-primary">{tx.userEmail}</td>
                  <td className="py-3 px-2 theme-text-secondary">{tx.librarianEmail}</td>
                  <td className="py-3 px-2 font-bold text-emerald-500">${tx.amount}</td>
                  <td className="py-3 px-2 text-right theme-text-secondary">
                    {new Date(tx.date).toLocaleDateString()}
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