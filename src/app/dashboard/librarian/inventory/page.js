"use client";

import { useState, useEffect } from "react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";
import { BookOpen, Eye, EyeOff, Trash2, Loader2 } from "lucide-react";

export default function ManageInventoryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosPublic.get("/librarian/my-books");
      if (res.data) setBooks(res.data);
    } catch (error) {
      toast.error("Failed to load inventory!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleToggleStatus = async (bookId, currentStatus) => {
    if (currentStatus === "Pending Approval") {
      return toast.warning("Librarian cannot publish a Pending Approval book!");
    }

    try {
      const res = await axiosPublic.patch(`/librarian/books/${bookId}/status`);
      toast.success(`Book status changed to ${res.data.status}`);
      setBooks((prev) => prev.map((b) => (b._id === bookId ? { ...b, status: res.data.status } : b)));
    } catch (error) {
      toast.error("Failed to update status!");
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await axiosPublic.delete(`/librarian/books/${bookId}`);
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
    <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-4">
      <h1 className="text-lg font-bold theme-text-primary flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-amber-500" /> Manage My Inventory
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b theme-border theme-text-secondary">
              <th className="py-3 px-2">Title</th>
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">Delivery Fee</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y theme-border">
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center theme-text-secondary">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="hover:bg-amber-500/5 transition-colors">
                  <td className="py-3 px-2 font-semibold theme-text-primary">{book.title}</td>
                  <td className="py-3 px-2 theme-text-secondary">{book.category}</td>
                  <td className="py-3 px-2 theme-text-primary">${book.deliveryFee}</td>
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
                    {book.status !== "Pending Approval" && (
                      <button
                        onClick={() => handleToggleStatus(book._id, book.status)}
                        className="p-1.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700"
                        title="Toggle Publish/Unpublish"
                      >
                        {book.status === "Published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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