"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import axiosPublic from "@/lib/axios";
import BookCard from "@/components/BookCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        // Fetch top 6 latest books from MongoDB backend
        const res = await axiosPublic.get("/books?limit=6&status=published");
        setBooks(res.data.books || res.data || []);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <section className="py-16 theme-bg-section border-t theme-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold theme-text-primary">Featured Books</h2>
            <p className="text-sm theme-text-secondary mt-1">Explore top books available for instant doorstep delivery</p>
          </div>
          <Link
            href="/books"
            className="text-amber-600 dark:text-amber-400 hover:underline font-semibold text-sm"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 border border-dashed theme-border rounded-xl theme-bg-card">
            <p className="theme-text-secondary text-base">No books available right now.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
          >
            {books.map((book) => (
              <BookCard key={book._id || book.id} book={book} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}