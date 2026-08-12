"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axiosPublic from "@/lib/axios";
import SkeletonCard from "@/components/SkeletonCard";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
} from "lucide-react";

export default function BorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);
        // 🟢 API Endpoint /deliveries/my-loans এ আপডেট করা হয়েছে
        const res = await axiosPublic.get("/deliveries/my-loans");
        
        // ব্যাকএন্ড রেসপন্স অনুযায়ী ডাটা রিসিভ করা
        const data = res.data.deliveries || res.data.loans || res.data || [];
        setBorrowedBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
        setBorrowedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 min-h-screen theme-bg-main space-y-6">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary">Borrowed Books</h1>
          <p className="text-xs theme-text-secondary mt-1">
            Loading your requested and borrowed items...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen theme-bg-main theme-text-primary space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b theme-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-amber-500" /> My Borrowed Books
          </h1>
          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Track your requested deliveries and currently borrowed library books.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all w-fit shadow-md"
        >
          Browse More Books <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Empty State */}
      {borrowedBooks.length === 0 ? (
        <div className="text-center py-16 theme-bg-card border theme-border rounded-3xl space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold theme-text-primary">
            No Borrowed Books Found
          </h2>
          <p className="text-xs theme-text-secondary max-w-sm mx-auto">
            You haven't requested or borrowed any books yet. Explore our
            collection and request a doorstep delivery!
          </p>
          <Link
            href="/books"
            className="inline-block bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
          >
            Explore Books
          </Link>
        </div>
      ) : (
        /* Books List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedBooks.map((item, index) => {
            // ব্যাকএন্ডে populate("book") নাম দেওয়া হয়েছে
            const book = item.book || item.bookId || item;
            const status = item.status || "Pending";

            return (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="theme-bg-card border theme-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="p-5 space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        status === "Delivered" || status === "Approved"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : status === "Pending"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {status === "Delivered" || status === "Approved" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : status === "Pending" ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {status}
                    </span>

                    <span className="text-[11px] theme-text-secondary flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-500" />
                      Fee: ${item.deliveryFee || "5.00"}
                    </span>
                  </div>

                  {/* Book Info Card */}
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden border theme-border shrink-0 bg-slate-800">
                      <Image
                        src={
                          book?.coverImage ||
                          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300"
                        }
                        alt={book?.title || "Book Cover"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="text-sm font-bold theme-text-primary line-clamp-2 leading-snug">
                        {book?.title || "Requested Book"}
                      </h3>
                      <p className="text-xs theme-text-secondary truncate">
                        By {book?.author || "Unknown Author"}
                      </p>

                      <div className="pt-1 flex items-center gap-1 text-[11px] theme-text-secondary">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        <span>
                          Ordered:{" "}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t theme-border bg-amber-500/5 flex justify-between items-center text-xs">
                  <span className="theme-text-secondary font-medium">
                    Return Due: <strong className="theme-text-primary">14 Days</strong>
                  </span>
                  {book?._id && (
                    <Link
                      href={`/books/${book._id}`}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}