"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Loader2,
  RefreshCw,
  CreditCard,
  Receipt,
} from "lucide-react";

import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH TRANSACTIONS
  // GET /admin/transactions
  // =====================================================

  const fetchTransactions = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await axiosPublic.get(
        "/admin/transactions"
      );

      // Backend returns:
      // {
      //   success: true,
      //   transactions: [...]
      // }

      if (res?.data?.success) {
        setTransactions(
          Array.isArray(
            res.data.transactions
          )
            ? res.data.transactions
            : []
        );
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error(
        "Transactions Fetch Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load transactions!"
      );

      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // =====================================================
  // CALCULATE TOTAL REVENUE
  // =====================================================

  const totalRevenue =
    transactions.reduce(
      (total, transaction) =>
        total +
        Number(transaction?.amount || 0),
      0
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">

          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />

          <p className="text-xs theme-text-secondary">
            Loading transactions...
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

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h1 className="text-xl md:text-2xl font-bold theme-text-primary flex items-center gap-2">

              <DollarSign className="w-6 h-6 text-amber-500" />

              Platform Payment Transactions

            </h1>

            <p className="text-xs theme-text-secondary mt-1">
              Monitor all completed and recorded
              payment transactions across the platform.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              fetchTransactions(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
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

        </div>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* TRANSACTION COUNT */}
        <div className="theme-bg-card border theme-border rounded-2xl p-5 flex items-center gap-4">

          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>

          <div>

            <p className="text-xs theme-text-secondary">
              Total Transactions
            </p>

            <p className="text-2xl font-bold theme-text-primary mt-1">
              {transactions.length}
            </p>

          </div>

        </div>

        {/* TOTAL REVENUE */}
        <div className="theme-bg-card border theme-border rounded-2xl p-5 flex items-center gap-4">

          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>

          <div>

            <p className="text-xs theme-text-secondary">
              Total Revenue
            </p>

            <p className="text-2xl font-bold text-emerald-500 mt-1">
              ${totalRevenue.toFixed(2)}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          TRANSACTIONS TABLE
      ================================================== */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left text-xs md:text-sm">

            <thead>

              <tr className="border-b theme-border theme-text-secondary">

                <th className="py-3 px-2">
                  Transaction ID
                </th>

                <th className="py-3 px-2">
                  User
                </th>

                <th className="py-3 px-2">
                  Librarian
                </th>

                <th className="py-3 px-2">
                  Book
                </th>

                <th className="py-3 px-2">
                  Amount
                </th>

                <th className="py-3 px-2">
                  Status
                </th>

                <th className="py-3 px-2 text-right">
                  Date
                </th>

              </tr>

            </thead>

            <tbody className="divide-y theme-border">

              {transactions.length === 0 ? (
                <tr>

                  <td
                    colSpan="7"
                    className="py-12 text-center"
                  >

                    <div className="flex flex-col items-center gap-3">

                      <div className="p-4 bg-amber-500/10 rounded-full text-amber-500">
                        <DollarSign className="w-7 h-7" />
                      </div>

                      <div>

                        <p className="font-semibold theme-text-primary">
                          No payment transactions found.
                        </p>

                        <p className="text-xs theme-text-secondary mt-1">
                          Transactions will appear here
                          after a successful payment.
                        </p>

                      </div>

                    </div>

                  </td>

                </tr>
              ) : (
                transactions.map(
                  (tx) => {

                    // -------------------------------------
                    // Support different possible field names
                    // -------------------------------------

                    const transactionId =
                      tx?.transactionId ||
                      tx?._id ||
                      "N/A";

                    const userEmail =
                      tx?.user?.email ||
                      tx?.userEmail ||
                      tx?.email ||
                      "N/A";

                    const librarianEmail =
                      tx?.librarian?.email ||
                      tx?.librarianEmail ||
                      "N/A";

                    const bookTitle =
                      tx?.book?.title ||
                      tx?.bookTitle ||
                      "N/A";

                    const amount =
                      Number(
                        tx?.amount || 0
                      );

                    const status =
                      tx?.status ||
                      "completed";

                    const transactionDate =
                      tx?.date ||
                      tx?.createdAt ||
                      tx?.updatedAt;

                    return (
                      <tr
                        key={
                          tx?._id ||
                          tx?.transactionId
                        }
                        className="hover:bg-amber-500/5 transition-colors"
                      >

                        {/* TRANSACTION ID */}
                        <td className="py-4 px-2">

                          <span className="font-mono text-amber-500 font-bold text-xs">
                            {transactionId}
                          </span>

                        </td>

                        {/* USER */}
                        <td className="py-4 px-2">

                          <div className="max-w-[220px]">

                            <p className="theme-text-primary font-medium truncate">
                              {userEmail}
                            </p>

                            {tx?.user?.name && (
                              <p className="text-[10px] theme-text-secondary mt-0.5">
                                {tx.user.name}
                              </p>
                            )}

                          </div>

                        </td>

                        {/* LIBRARIAN */}
                        <td className="py-4 px-2">

                          <div className="max-w-[220px]">

                            <p className="theme-text-secondary truncate">
                              {librarianEmail}
                            </p>

                            {tx?.librarian?.name && (
                              <p className="text-[10px] theme-text-secondary mt-0.5">
                                {tx.librarian.name}
                              </p>
                            )}

                          </div>

                        </td>

                        {/* BOOK */}
                        <td className="py-4 px-2">

                          <span className="theme-text-primary font-medium">
                            {bookTitle}
                          </span>

                        </td>

                        {/* AMOUNT */}
                        <td className="py-4 px-2">

                          <span className="font-bold text-emerald-500">
                            ${amount.toFixed(2)}
                          </span>

                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-2">

                          <span
                            className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                              status ===
                              "completed"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : status ===
                                  "pending"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}
                          >
                            {String(
                              status
                            ).toUpperCase()}
                          </span>

                        </td>

                        {/* DATE */}
                        <td className="py-4 px-2 text-right theme-text-secondary">

                          {transactionDate ? (
                            new Date(
                              transactionDate
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          ) : (
                            "N/A"
                          )}

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}