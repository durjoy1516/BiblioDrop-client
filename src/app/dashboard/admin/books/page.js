"use client";

import { useState, useEffect } from "react";
import { BookOpen, Check, EyeOff, Trash2, Loader2 } from "lucide-react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // axiosPublic-এ আগে থেকেই /api যুক্ত আছে, তাই শুধু /admin/books হবে
      const res = await axiosPublic.get("/admin/books");
      if (res.data) setBooks(res.data);
    } catch (error) {
      console.error("Books Fetch Error:", error);
      toast.error("Failed to load books!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleApprove = async (bookId) => {
    try {
      await axiosPublic.patch(`/admin/books/${bookId}/approve`);
      toast.success("Book approved and published!");
      setBooks((prev) => prev.map((b) => (b._id === bookId ? { ...b, status: "Published" } : b)));
    } catch (error) {
      toast.error("Failed to approve book!");
    }
  };

  const handleUnpublish = async (bookId) => {
    try {
      await axiosPublic.patch(`/admin/books/${bookId}/unpublish`);
      toast.info("Book unpublished!");
      setBooks((prev) => prev.map((b) => (b._id === bookId ? { ...b, status: "Unpublished" } : b)));
    } catch (error) {
      toast.error("Failed to unpublish book!");
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Are you sure you want to permanently delete this book?")) return;

    try {
      await axiosPublic.delete(`/admin/books/${bookId}`);
      toast.success("Book deleted successfully!");
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (error) {
      toast.error("Failed to delete book!");
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold theme-text-primary flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-amber-500" /> Book Approval Queue & Manage Listings
      </h1>

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b theme-border theme-text-secondary">
              <th className="py-3 px-2">Book Title</th>
              <th className="py-3 px-2">Author</th>
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y theme-border">
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center theme-text-secondary">
                  No books found in the system.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="hover:bg-amber-500/5 transition-colors">
                  <td className="py-3 px-2 font-semibold theme-text-primary">{book.title}</td>
                  <td className="py-3 px-2 theme-text-secondary">{book.author}</td>
                  <td className="py-3 px-2 theme-text-secondary">{book.category}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        book.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : book.status === "Pending Approval"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    {book.status === "Pending Approval" && (
                      <button
                        onClick={() => handleApprove(book._id)}
                        className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400"
                        title="Approve & Publish"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {book.status === "Published" && (
                      <button
                        onClick={() => handleUnpublish(book._id)}
                        className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20"
                        title="Force Unpublish"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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