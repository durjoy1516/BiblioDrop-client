"use client";

import { useState, useEffect } from "react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";
import {
  BookOpen,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function ManageInventoryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // FETCH MY BOOKS
  // Backend: GET /books/owner/my-books
  // =====================================================
  const fetchMyBooks = async () => {
    try {
      setLoading(true);

      const res = await axiosPublic.get("/books/owner/my-books");

      const data = res?.data;

      // Backend returns:
      // { success: true, books: [...] }
      const list = Array.isArray(data?.books)
        ? data.books
        : Array.isArray(data)
        ? data
        : [];

      setBooks(list);
    } catch (error) {
      console.error("Failed to load inventory:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load inventory!"
      );

      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  // =====================================================
  // TOGGLE PUBLISH / UNPUBLISH
  // Backend: PATCH /books/:id/toggle-publish
  // =====================================================
  const handleToggleStatus = async (bookId, currentStatus) => {
    if (currentStatus === "Pending Approval") {
      toast.warning(
        "Pending Approval books cannot be published by librarians."
      );
      return;
    }

    if (currentStatus === "Checked Out") {
      toast.warning(
        "Checked-out books cannot be unpublished until delivered."
      );
      return;
    }

    try {
      setUpdatingId(bookId);

      const res = await axiosPublic.patch(
        `/books/${bookId}/toggle-publish`
      );

      const updatedBook = res?.data?.book;

      if (updatedBook) {
        setBooks((prev) =>
          prev.map((book) =>
            book._id === bookId
              ? updatedBook
              : book
          )
        );
      } else {
        setBooks((prev) =>
          prev.map((book) =>
            book._id === bookId
              ? {
                  ...book,
                  status:
                    currentStatus === "Published"
                      ? "Unpublished"
                      : "Published",
                }
              : book
          )
        );
      }

      toast.success(
        res?.data?.message ||
          "Book status updated successfully!"
      );
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update book status!"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // DELETE BOOK
  // Backend: DELETE /books/:id
  // =====================================================
  const handleDelete = async (bookId, status) => {
    if (status === "Checked Out") {
      toast.warning(
        "Checked-out books cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(bookId);

      await axiosPublic.delete(`/books/${bookId}`);

      toast.success(
        "Book deleted successfully!"
      );

      setBooks((prev) =>
        prev.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      console.error("Delete error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete book!"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <h1 className="text-xl md:text-2xl font-bold theme-text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500" />
              Manage My Inventory
            </h1>

            <p className="text-xs theme-text-secondary mt-1">
              Manage your listed books and their availability.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchMyBooks}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>
      </div>

      {/* Inventory */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs md:text-sm">

            <thead>
              <tr className="border-b theme-border theme-text-secondary">

                <th className="py-3 px-2">
                  Title
                </th>

                <th className="py-3 px-2">
                  Author
                </th>

                <th className="py-3 px-2">
                  Category
                </th>

                <th className="py-3 px-2">
                  Delivery Fee
                </th>

                <th className="py-3 px-2">
                  Status
                </th>

                <th className="py-3 px-2 text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y theme-border">

              {books.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center theme-text-secondary"
                  >
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                books.map((book) => {

                  const isUpdating =
                    updatingId === book._id;

                  const isPending =
                    book.status === "Pending Approval";

                  const isCheckedOut =
                    book.status === "Checked Out";

                  return (
                    <tr
                      key={book._id}
                      className="hover:bg-amber-500/5 transition-colors"
                    >

                      {/* Title */}
                      <td className="py-4 px-2 font-semibold theme-text-primary">
                        {book.title}
                      </td>

                      {/* Author */}
                      <td className="py-4 px-2 theme-text-secondary">
                        {book.author || "N/A"}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-2 theme-text-secondary">
                        {book.category}
                      </td>

                      {/* Fee */}
                      <td className="py-4 px-2 theme-text-primary font-semibold">
                        $
                        {Number(
                          book.deliveryFee || 0
                        ).toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                            book.status === "Published"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : book.status ===
                                "Pending Approval"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : book.status ===
                                "Checked Out"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-2 text-right">

                        <div className="inline-flex items-center gap-2">

                          {/* Publish / Unpublish */}
                          {!isPending && (
                            <button
                              type="button"
                              disabled={
                                isUpdating ||
                                isCheckedOut
                              }
                              onClick={() =>
                                handleToggleStatus(
                                  book._id,
                                  book.status
                                )
                              }
                              className="p-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              title={
                                isCheckedOut
                                  ? "Checked-out book cannot be unpublished"
                                  : book.status ===
                                    "Published"
                                  ? "Unpublish"
                                  : "Publish"
                              }
                            >
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : book.status ===
                                "Published" ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={
                              isUpdating ||
                              isCheckedOut
                            }
                            onClick={() =>
                              handleDelete(
                                book._id,
                                book.status
                              )
                            }
                            className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={
                              isCheckedOut
                                ? "Checked-out book cannot be deleted"
                                : "Delete Listing"
                            }
                          >
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}