"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosPublic from "@/lib/axios";
import BookCard from "@/components/BookCard";
import SkeletonCard from "@/components/SkeletonCard";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Fiction",
  "Sci-Fi",
  "Academic",
  "Drama",
  "Romance",
  "Science",
  "Dystopian",
  "Classic",
  "Self-Help",
  "Philosophy",
  "History",
  "Fantasy",
  "Finance",
  "Psychology",
  "Biography",
  "Historical Fiction",
  "Spirituality",
  "Horror",
  "Memoir",
  "Adventure",
  "Thriller",
  "Technology",
  "Business",
];

const LIMIT = 12;

export default function BrowseBooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL থেকে initial values
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [availability, setAvailability] = useState("all");
  const [maxFee, setMaxFee] = useState(100);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // =====================================================
  // FETCH BOOKS
  // =====================================================

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", currentPage);
      params.set("limit", LIMIT);

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      if (selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }

      /*
       * Backend-এর জন্য availability filter
       *
       * available -> Published
       * checkout  -> Checked Out
       */
      if (availability === "available") {
        params.set("status", "Published");
      }

      if (availability === "checkout") {
        params.set("status", "Checked Out");
      }

      // Default $100 হলে filter পাঠানোর দরকার নেই
      if (maxFee < 100) {
        params.set("maxFee", maxFee);
      }

      const res = await axiosPublic.get(
        `/books?${params.toString()}`
      );

      const data = res?.data;

      /*
       * Backend বিভিন্ন structure return করতে পারে:
       *
       * {
       *   success: true,
       *   books: [],
       *   totalPages: 2
       * }
       *
       * অথবা
       *
       * []
       */

      let fetchedBooks = [];

      if (Array.isArray(data)) {
        fetchedBooks = data;
      } else if (Array.isArray(data?.books)) {
        fetchedBooks = data.books;
      } else if (Array.isArray(data?.data)) {
        fetchedBooks = data.data;
      }

      setBooks(fetchedBooks);

      // Total pages
      const pages = Number(
        data?.totalPages ||
          data?.pagination?.totalPages ||
          data?.meta?.totalPages
      );

      if (Number.isFinite(pages) && pages > 0) {
        setTotalPages(pages);
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Books fetch error:", err);

      setBooks([]);
      setTotalPages(1);

      setError(
        err?.response?.data?.message ||
          "Failed to load books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    availability,
    maxFee,
  ]);

  // Fetch whenever filters/page change
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // =====================================================
  // SYNC SEARCH + CATEGORY WITH URL
  // =====================================================

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }

    const query = params.toString();

    const newUrl = query
      ? `/books?${query}`
      : "/books";

    router.replace(newUrl, {
      scroll: false,
    });
  }, [searchTerm, selectedCategory, router]);

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setAvailability("all");
    setMaxFee(100);
    setCurrentPage(1);

    router.replace("/books", {
      scroll: false,
    });
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // CATEGORY
  // =====================================================

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // AVAILABILITY
  // =====================================================

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
    setCurrentPage(1);
  };

  // =====================================================
  // MAX FEE
  // =====================================================

  const handleMaxFeeChange = (e) => {
    setMaxFee(Number(e.target.value));
    setCurrentPage(1);
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  const getPageNumbers = () => {
    const pages = [];

    // ছোট pagination হলে সব দেখাবে
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // প্রথম কয়েকটা page
    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen theme-bg-main theme-text-primary py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold theme-text-primary">
            Explore Book Collection
          </h1>

          <p className="text-sm md:text-base theme-text-secondary">
            Find books from nearby libraries, filter by
            category, and request doorstep delivery instantly.
          </p>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="theme-bg-card border theme-border rounded-2xl p-5 shadow-lg space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* SEARCH */}

            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3.5 theme-text-secondary" />

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by book title or author..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="theme-bg-card"
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>
                ))}
              </select>
            </div>

            {/* AVAILABILITY */}

            <div>
              <select
                value={availability}
                onChange={handleAvailabilityChange}
                className="w-full px-3 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option
                  value="all"
                  className="theme-bg-card"
                >
                  All Status
                </option>

                <option
                  value="available"
                  className="theme-bg-card"
                >
                  Available Now
                </option>

                <option
                  value="checkout"
                  className="theme-bg-card"
                >
                  Checked Out
                </option>
              </select>
            </div>
          </div>

          {/* MAX FEE + RESET */}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t theme-border">

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-semibold text-sm theme-text-primary whitespace-nowrap">
                Max Fee/Price: ${maxFee}
              </span>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={maxFee}
                onChange={handleMaxFeeChange}
                className="accent-amber-500 cursor-pointer w-36"
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && !loading && (
          <div className="theme-bg-card border border-rose-500/30 rounded-2xl p-6 text-center">

            <p className="text-sm text-rose-500 font-medium">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchBooks}
              className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          books.length === 0 && (
            <div className="theme-bg-card border border-dashed theme-border rounded-2xl p-12 text-center space-y-4">

              <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold theme-text-primary">
                No Books Found
              </h3>

              <p className="text-sm theme-text-secondary max-w-sm mx-auto">
                We couldn&apos;t find any books matching your
                current search or filters. Try adjusting your
                search query.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

        {/* =================================================
            BOOK GRID
        ================================================= */}

        {!loading &&
          !error &&
          books.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => {
                const bookId = book?._id || book?.id;

                // Invalid book data হলে render না করা
                if (!bookId) return null;

                return (
                  <BookCard
                    key={bookId}
                    book={book}
                  />
                );
              })}
            </div>
          )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          !error &&
          books.length > 0 &&
          totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={goToPreviousPage}
                className="p-2 rounded-lg border theme-border theme-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-500/10 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* PAGE NUMBERS */}

              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 theme-text-secondary"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    type="button"
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                      currentPage === page
                        ? "bg-amber-500 text-slate-950"
                        : "border theme-border theme-text-primary hover:bg-amber-500/10"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* NEXT */}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={goToNextPage}
                className="p-2 rounded-lg border theme-border theme-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-500/10 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
      </div>
    </div>
  );
}