"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosPublic from "@/lib/axios";
import BookCard from "@/components/BookCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, RotateCcw, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

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
  "Business"
];

export default function BrowseBooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters or Defaults
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  // Component States
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState("all");
  const [maxFee, setMaxFee] = useState(50);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Set limit to 'all' to fetch all 33 books at once, or set a number (e.g., 33)
  const limit = "all"; 

  // Fetch Books Function
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (availability !== "all") params.append("availability", availability);
      if (maxFee) params.append("maxFee", maxFee);

      const res = await axiosPublic.get(`/books?${params.toString()}`);
      
      const fetchedBooks = res.data.books || res.data || [];
      const total = res.data.totalPages || 1;

      setBooks(fetchedBooks);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, availability, maxFee, limit]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handle Reset Filters
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setAvailability("all");
    setMaxFee(50);
    setCurrentPage(1);
    router.push("/books");
  };

  return (
    <div className="min-h-screen theme-bg-main theme-text-primary py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold theme-text-primary">
            Explore Book Collection
          </h1>
          <p className="text-sm md:text-base theme-text-secondary">
            Find books from nearby libraries, filter by category, and request doorstep delivery instantly.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="theme-bg-card border theme-border rounded-2xl p-5 shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3.5 theme-text-secondary" />
              <input
                type="text"
                placeholder="Search by book title or author..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="theme-bg-card">
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={availability}
                onChange={(e) => {
                  setAvailability(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all" className="theme-bg-card">All Status</option>
                <option value="available" className="theme-bg-card">Available Now</option>
                <option value="checkout" className="theme-bg-card">Checked Out</option>
              </select>
            </div>
          </div>

          {/* Delivery Fee / Price Range & Reset Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t theme-border text-xs theme-text-secondary">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="font-semibold text-sm theme-text-primary">Max Fee/Price: ${maxFee}</span>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={maxFee}
                onChange={(e) => {
                  setMaxFee(e.target.value);
                  setCurrentPage(1);
                }}
                className="accent-amber-500 cursor-pointer w-36"
              />
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        </div>

        {/* Books Display Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          /* Empty State */
          <div className="theme-bg-card border border-dashed theme-border rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold theme-text-primary">No Books Found</h3>
            <p className="text-sm theme-text-secondary max-w-sm mx-auto">
              We couldn't find any books matching your current search or filters. Try adjusting your search query.
            </p>
            <button
              onClick={handleReset}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id || book.id} book={book} />
            ))}
          </div>
        )}

        {/* Pagination Controls - Only shows if limit is numeric and totalPages > 1 */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 rounded-lg border theme-border theme-text-primary disabled:opacity-40 hover:bg-amber-500/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                    currentPage === pageNum
                      ? "bg-amber-500 text-slate-950"
                      : "border theme-border theme-text-primary hover:bg-amber-500/10"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-2 rounded-lg border theme-border theme-text-primary disabled:opacity-40 hover:bg-amber-500/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}