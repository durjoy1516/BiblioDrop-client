"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axiosPublic from "@/lib/axios";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "@/context/AuthContext";

import {
  Tag,
  Truck,
  CheckCircle,
  XCircle,
  Star,
  ArrowLeft,
  Clock,
  ShieldCheck,
  CreditCard,
  Loader2,
  Lock,
} from "lucide-react";

import {
  loadStripe,
} from "@stripe/stripe-js";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// =====================================================
// STRIPE PAYMENT COMPONENT
// =====================================================

function PaymentSection({
  user,
  book,
  bookId,
  deliveryFee,
  isUnavailable,
  onSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardReady, setCardReady] = useState(false);

  // ===================================================
  // PAYMENT
  // ===================================================

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setError("Stripe is still loading. Please wait a moment.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card information is not available.");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      // ------------------------------------------------
      // STEP 1
      // CREATE PAYMENT INTENT
      // ------------------------------------------------

      const res = await axiosPublic.post(
        "/deliveries/create-payment-intent",
        {
          bookId,
        }
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Unable to create payment."
        );
      }

      const clientSecret =
        res.data?.clientSecret;

      if (!clientSecret) {
        throw new Error(
          "Payment client secret was not returned by server."
        );
      }

      // ------------------------------------------------
      // STEP 2
      // CONFIRM CARD PAYMENT
      // ------------------------------------------------

      const result =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,

              billing_details: {
                name:
                  user?.name ||
                  user?.displayName ||
                  "Customer",

                email:
                  user?.email ||
                  "",
              },
            },
          }
        );

      if (result.error) {
        throw new Error(
          result.error.message ||
            "Payment failed."
        );
      }

      // ------------------------------------------------
      // STEP 3
      // CHECK PAYMENT STATUS
      // ------------------------------------------------

      const paymentIntent =
        result.paymentIntent;

      if (!paymentIntent) {
        throw new Error(
          "Payment information was not returned."
        );
      }

      if (
        paymentIntent.status !==
        "succeeded"
      ) {
        throw new Error(
          `Payment was not completed. Status: ${paymentIntent.status}`
        );
      }

      // ------------------------------------------------
      // STEP 4
      // CONFIRM PAYMENT ON BACKEND
      // ------------------------------------------------

      const confirmRes =
        await axiosPublic.post(
          "/deliveries/confirm-payment",
          {
            paymentIntentId:
              paymentIntent.id,
          }
        );

      if (!confirmRes.data?.success) {
        throw new Error(
          confirmRes.data?.message ||
            "Payment succeeded but delivery request could not be created."
        );
      }

      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      onSuccess();

    } catch (err) {
      console.error(
        "PAYMENT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ===================================================
  // UI
  // ===================================================

  if (isUnavailable) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          disabled
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-500/20 text-slate-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed"
        >
          <XCircle className="w-4 h-4" />
          Currently Unavailable
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ================================================
          CARD INPUT
      ================================================ */}

      <div className="rounded-2xl border theme-border bg-black/5 dark:bg-white/5 p-4">

        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-amber-500" />

          <p className="text-xs font-bold theme-text-primary">
            Card Information
          </p>
        </div>

        <div className="rounded-xl border theme-border bg-white dark:bg-slate-900 p-4">

          <CardElement
            onChange={(event) => {
              setCardReady(
                event.complete
              );

              if (event.error) {
                setError(
                  event.error.message
                );
              } else {
                setError("");
              }
            }}
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#64748b",
                  fontFamily:
                    "Arial, sans-serif",
                  "::placeholder": {
                    color: "#94a3b8",
                  },
                },

                invalid: {
                  color: "#ef4444",
                },
              },

              hidePostalCode: true,
            }}
          />

        </div>

        <div className="flex items-center gap-2 mt-3 text-[10px] theme-text-secondary">
          <Lock className="w-3 h-3" />
          Your card information is securely processed by Stripe.
        </div>

      </div>

      {/* ================================================
          PAYMENT ERROR
      ================================================ */}

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
          {error}
        </div>
      )}

      {/* ================================================
          PAY BUTTON
      ================================================ */}

      <button
        type="button"
        onClick={handlePayment}
        disabled={
          processing ||
          !stripe ||
          !elements ||
          !cardReady
        }
        className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >

        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Pay ${deliveryFee.toFixed(2)} & Request
          </>
        )}

      </button>

    </div>
  );
}

// =====================================================
// MAIN BOOK DETAILS PAGE
// =====================================================

export default function BookDetailsPage({
  params,
}) {
  const resolvedParams = use(params);

  const id = resolvedParams?.id;

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [book, setBook] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [requestSuccess, setRequestSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH BOOK + REVIEWS
  // =====================================================

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // -----------------------------------------------
        // BOOK
        // -----------------------------------------------

        const bookRes =
          await axiosPublic.get(
            `/books/${id}`
          );

        const bookData =
          bookRes.data?.book ||
          bookRes.data?.data ||
          bookRes.data;

        setBook(bookData);

        // -----------------------------------------------
        // REVIEWS
        // -----------------------------------------------

        try {
          const reviewRes =
            await axiosPublic.get(
              `/reviews?bookId=${id}`
            );

          const reviewData =
            reviewRes.data?.reviews ||
            reviewRes.data?.data ||
            reviewRes.data ||
            [];

          setReviews(
            Array.isArray(reviewData)
              ? reviewData
              : []
          );

        } catch (reviewError) {
          console.warn(
            "Reviews could not be loaded:",
            reviewError
          );

          setReviews([]);
        }

      } catch (err) {
        console.error(
          "Error fetching book details:",
          err
        );

        setBook(null);

        setError(
          err?.response?.data?.message ||
            "Failed to load book details."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  // =====================================================
  // SUCCESS
  // =====================================================

  const handlePaymentSuccess = () => {
    setRequestSuccess(true);

    setError("");

    setBook((prev) => ({
      ...prev,
      status: "Checked Out",
    }));
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen theme-bg-main py-12 px-4 flex justify-center items-center">

        <div className="max-w-md w-full">
          <SkeletonCard />
        </div>

      </div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!book) {
    return (
      <div className="min-h-screen theme-bg-main py-16 px-4 text-center">

        <div className="max-w-md mx-auto theme-bg-card border theme-border rounded-2xl p-8 space-y-4">

          <h2 className="text-2xl font-bold theme-text-primary">
            Book Not Found
          </h2>

          <p className="text-sm theme-text-secondary">
            {error ||
              "The book you are looking for does not exist or has been removed."}
          </p>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Books
          </Link>

        </div>

      </div>
    );
  }

  // =====================================================
  // BOOK STATE
  // =====================================================

  const isUnavailable =
    book?.status === "Checked Out" ||
    book?.available === false;

  const deliveryFee =
    book?.deliveryFee !== undefined
      ? Number(book.deliveryFee)
      : Number(book?.price || 5);

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen theme-bg-main theme-text-primary py-10 px-4">

      <div className="max-w-5xl mx-auto space-y-10">

        {/* ==============================================
            BACK
        ============================================== */}

        <div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-xs font-semibold theme-text-secondary hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse Books
          </Link>

        </div>

        {/* ==============================================
            ERROR
        ============================================== */}

        {error && !requestSuccess && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm">
            {error}
          </div>
        )}

        {/* ==============================================
            MAIN DETAILS
        ============================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 theme-bg-card border theme-border rounded-3xl p-6 md:p-8 shadow-xl"
        >

          {/* ============================================
              COVER
          ============================================ */}

          <div className="md:col-span-5 relative">

            <div className="relative w-full h-80 md:h-full min-h-[360px] rounded-2xl overflow-hidden border theme-border shadow-md">

              <Image
                src={
                  book?.coverImage ||
                  FALLBACK_IMAGE
                }
                alt={
                  book?.title ||
                  "Book Cover"
                }
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                className="object-cover"
                priority
              />

              {/* Availability */}

              <div className="absolute top-3 left-3">

                {isUnavailable ? (
                  <span className="bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <XCircle className="w-3.5 h-3.5" />
                    Checked Out
                  </span>
                ) : (
                  <span className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Available Now
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* ============================================
              DETAILS
          ============================================ */}

          <div className="md:col-span-7 flex flex-col justify-between space-y-6">

            <div className="space-y-4">

              {/* Category */}

              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">

                <Tag className="w-3.5 h-3.5" />

                <span>
                  {book?.category ||
                    book?.genre ||
                    "General"}
                </span>

              </div>

              {/* Title */}

              <h1 className="text-2xl md:text-4xl font-extrabold theme-text-primary leading-tight">
                {book?.title ||
                  "Untitled Book"}
              </h1>

              {/* Author */}

              <p className="text-sm theme-text-secondary font-medium">

                Written by{" "}

                <span className="theme-text-primary font-bold">
                  {book?.author ||
                    "Unknown"}
                </span>

              </p>

              {/* Description */}

              <div className="pt-2 border-t theme-border">

                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                  Synopsis
                </h3>

                <p className="text-xs md:text-sm theme-text-secondary leading-relaxed">
                  {book?.description ||
                    "No detailed description provided for this book yet."}
                </p>

              </div>

            </div>

            {/* ==========================================
                DELIVERY / PAYMENT
            ========================================== */}

            <div className="p-4 rounded-2xl bg-amber-500/5 border theme-border space-y-4">

              <div className="flex items-center justify-between text-xs md:text-sm">

                <span className="theme-text-secondary flex items-center gap-1.5">

                  <Truck className="w-4 h-4 text-amber-500" />

                  Doorstep Delivery Fee

                </span>

                <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                  ${deliveryFee.toFixed(2)}
                </span>

              </div>

              {/* ========================================
                  SUCCESS
              ======================================== */}

              {requestSuccess ? (

                <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-semibold">

                  <CheckCircle className="w-5 h-5" />

                  <span>
                    Payment successful!
                    Your delivery request has been created.
                  </span>

                </div>

              ) : !user && !authLoading ? (

                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  Login to Request Delivery
                </Link>

              ) : (

                <Elements stripe={stripePromise}>

                  <PaymentSection
                    user={user}
                    book={book}
                    bookId={id}
                    deliveryFee={deliveryFee}
                    isUnavailable={isUnavailable}
                    onSuccess={
                      handlePaymentSuccess
                    }
                  />

                </Elements>

              )}

              <div className="flex flex-col sm:flex-row justify-between gap-2 text-[10px] theme-text-secondary pt-1">

                <span className="flex items-center gap-1">

                  <Clock className="w-3 h-3" />

                  Delivery in 24-48 Hours

                </span>

                <span className="flex items-center gap-1">

                  <ShieldCheck className="w-3 h-3" />

                  Secured by Stripe

                </span>

              </div>

            </div>

          </div>

        </motion.div>

        {/* ==============================================
            REVIEWS
        ============================================== */}

        <div className="theme-bg-card border theme-border rounded-3xl p-6 md:p-8 shadow-lg space-y-6">

          <div className="flex items-center justify-between border-b theme-border pb-4">

            <div>

              <h2 className="text-xl font-bold theme-text-primary">
                Reader Reviews
              </h2>

              <p className="text-xs theme-text-secondary mt-0.5">
                Feedback from readers who received this book
              </p>

            </div>

            {reviews.length > 0 && (

              <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">

                <Star className="w-4 h-4 fill-amber-500" />

                <span>

                  {(
                    reviews.reduce(
                      (sum, review) =>
                        sum +
                        Number(
                          review?.rating || 0
                        ),
                      0
                    ) /
                    reviews.length
                  ).toFixed(1)}

                  {" / 5.0"}

                </span>

              </div>

            )}

          </div>

          {/* NO REVIEWS */}

          {reviews.length === 0 ? (

            <div className="text-center py-8 border border-dashed theme-border rounded-2xl">

              <p className="text-xs theme-text-secondary">
                No reviews yet for this book.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {reviews.map(
                (review, index) => {

                  const rating =
                    Math.min(
                      5,
                      Math.max(
                        1,
                        Number(
                          review?.rating || 5
                        )
                      )
                    );

                  return (

                    <div
                      key={
                        review?._id ||
                        index
                      }
                      className="p-4 rounded-xl border theme-border bg-amber-500/5 space-y-2"
                    >

                      <div className="flex justify-between items-center gap-3">

                        <span className="text-xs font-bold theme-text-primary">
                          {review?.userName ||
                            review?.user?.name ||
                            "Verified Reader"}
                        </span>

                        <div className="flex items-center gap-0.5 text-amber-500">

                          {Array.from({
                            length: rating,
                          }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-amber-500"
                              />
                            )
                          )}

                        </div>

                      </div>

                      <p className="text-xs theme-text-secondary leading-relaxed">
                        "
                        {review?.comment ||
                          "Great book and fast delivery!"}
                        "
                      </p>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}