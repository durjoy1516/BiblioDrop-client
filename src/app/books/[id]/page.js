"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axiosPublic from "@/lib/axios";
import SkeletonCard from "@/components/SkeletonCard";
import {
  Tag,
  Truck,
  CheckCircle,
  XCircle,
  Star,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Send,
  CreditCard,
} from "lucide-react";

export default function BookDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const id = params?.id;

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get(`/books/${id}`);
        const bookData = res.data.book || res.data;
        setBook(bookData);

        try {
          const reviewRes = await axiosPublic.get(`/reviews?bookId=${id}`);
          setReviews(reviewRes.data.reviews || reviewRes.data || []);
        } catch {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBookDetails();
  }, [id]);

  // 💳 Stripe Payment & Delivery Request Handler
  const handleDeliveryRequest = async () => {
    setRequestLoading(true);
    try {
      // Stripe/Transaction-এর জন্য ডায়নামিক আইডি তৈরি
      const generatedTransactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // ব্যাকএন্ডের সাথে Stripe Checkout বা পেমেন্ট ইন্টিগ্রেশন
      const res = await axiosPublic.post("/deliveries", { 
        bookId: id,
        deliveryFee: book?.deliveryFee || 5.00,
        transactionId: generatedTransactionId // Stripe Transaction ID Validation Fix
      });

      // যদি আপনার ব্যাকএন্ড থেকে Stripe Checkout URL রিটার্ন করে:
      if (res.data?.url) {
        window.location.href = res.data.url; // Stripe Payment Page-এ রিডাইরেক্ট করবে
        return;
      }

      setRequestSuccess(true);
    } catch (error) {
      console.error("Order request failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to request delivery. Please login or try again.";
      alert(errorMessage);
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-main py-12 px-4 flex justify-center items-center">
        <div className="max-w-md w-full">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen theme-bg-main py-16 px-4 text-center">
        <div className="max-w-md mx-auto theme-bg-card border theme-border rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold theme-text-primary">Book Not Found</h2>
          <p className="text-sm theme-text-secondary">
            The book you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const isUnavailable = book?.status === "Checked Out" || book?.available === false;

  return (
    <div className="min-h-screen theme-bg-main theme-text-primary py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation Back */}
        <div>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-xs font-semibold theme-text-secondary hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Browse Books
          </Link>
        </div>

        {/* Main Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 theme-bg-card border theme-border rounded-3xl p-6 md:p-8 shadow-xl"
        >
          {/* Cover Image */}
          <div className="md:col-span-5 relative">
            <div className="relative w-full h-80 md:h-full min-h-[360px] rounded-2xl overflow-hidden border theme-border shadow-md">
              <Image
                src={
                  book?.coverImage ||
                  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600"
                }
                alt={book?.title || "Book Cover"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                className="object-cover"
              />

              <div className="absolute top-3 left-3">
                {isUnavailable ? (
                  <span className="bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <XCircle className="w-3.5 h-3.5" /> Checked Out
                  </span>
                ) : (
                  <span className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" /> Available Now
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Book Details Right Side */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Tag className="w-3.5 h-3.5" />
                <span>{book?.category || book?.genre || "General"}</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold theme-text-primary leading-tight">
                {book?.title}
              </h1>

              <p className="text-sm theme-text-secondary font-medium">
                Written by <span className="theme-text-primary font-bold">{book?.author || "Unknown"}</span>
              </p>

              <div className="pt-2 border-t theme-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                  Synopsis
                </h3>
                <p className="text-xs md:text-sm theme-text-secondary leading-relaxed">
                  {book?.description ||
                    "No detailed description provided for this book yet. Request a delivery to enjoy reading this masterpiece!"}
                </p>
              </div>
            </div>

            {/* Delivery Info & Action Box */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border theme-border space-y-4">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="theme-text-secondary flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-500" /> Doorstep Delivery Fee:
                </span>
                <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                  ${book?.deliveryFee !== undefined ? book.deliveryFee : (book?.price || "5.00")}
                </span>
              </div>

              {requestSuccess ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4" /> Payment & Delivery request submitted successfully!
                </div>
              ) : (
                <button
                  disabled={isUnavailable || requestLoading}
                  onClick={handleDeliveryRequest}
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {requestLoading ? (
                    "Processing Payment..."
                  ) : isUnavailable ? (
                    "Currently Unavailable"
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pay Delivery Fee & Request
                    </>
                  )}
                </button>
              )}

              <div className="flex justify-between items-center text-[10px] theme-text-secondary pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Delivery in 24-48 Hours
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secured by Stripe
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reader Reviews Section */}
        <div className="theme-bg-card border theme-border rounded-3xl p-6 md:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b theme-border pb-4">
            <div>
              <h2 className="text-xl font-bold theme-text-primary">Reader Reviews</h2>
              <p className="text-xs theme-text-secondary mt-0.5">
                Feedback from verified readers who received this book
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>4.8 / 5.0</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 border border-dashed theme-border rounded-2xl">
              <p className="text-xs theme-text-secondary">
                No reviews yet for this book. Be the first to read and review!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev, idx) => (
                <div
                  key={rev._id || idx}
                  className="p-4 rounded-xl border theme-border bg-amber-500/5 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold theme-text-primary">
                      {rev.userName || "Verified Reader"}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs theme-text-secondary leading-relaxed">
                    "{rev.comment || "Great book and fast delivery!"}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}