"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to an error reporting service if needed
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen theme-bg-main flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full theme-bg-card border theme-border rounded-2xl p-8 text-center shadow-xl space-y-6">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto border theme-border">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold theme-text-primary">
            Something Went Wrong!
          </h2>
          <p className="text-sm theme-text-secondary leading-relaxed">
            {error?.message || "An unexpected error occurred while loading this page. Please try again."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg transition-colors shadow"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border theme-border theme-text-primary hover:bg-amber-500/10 font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}