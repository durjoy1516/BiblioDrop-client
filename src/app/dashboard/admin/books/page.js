"use client";

import { useState, useEffect } from "react";

import {
  BookOpen,
  Check,
  EyeOff,
  Trash2,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";

import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // =====================================================
  // FETCH ALL BOOKS
  // GET /admin/books
  // =====================================================

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res =
        await axiosPublic.get("/admin/books");

      const list =
        Array.isArray(res?.data?.books)
          ? res.data.books
          : Array.isArray(res?.data)
          ? res.data
          : [];

      setBooks(list);
    } catch (error) {
      console.error(
        "Books Fetch Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load books!"
      );

      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // =====================================================
  // APPROVE BOOK
  // =====================================================

  const handleApprove = async (bookId) => {
    if (!bookId) return;

    try {
      setActionId(bookId);

      const res =
        await axiosPublic.patch(
          `/admin/books/${bookId}/approve`
        );

      const updatedBook =
        res?.data?.book;

      setBooks((prev) =>
        prev.map((book) =>
          book._id === bookId
            ? updatedBook || {
                ...book,
                status: "Published",
              }
            : book
        )
      );

      toast.success(
        "Book approved and published!"
      );
    } catch (error) {
      console.error(
        "Approve book error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to approve book!"
      );
    } finally {
      setActionId(null);
    }
  };

  // =====================================================
  // UNPUBLISH BOOK
  // =====================================================

  const handleUnpublish = async (
    bookId
  ) => {
    if (!bookId) return;

    try {
      setActionId(bookId);

      const res =
        await axiosPublic.patch(
          `/admin/books/${bookId}/unpublish`
        );

      const updatedBook =
        res?.data?.book;

      setBooks((prev) =>
        prev.map((book) =>
          book._id === bookId
            ? updatedBook || {
                ...book,
                status: "Unpublished",
              }
            : book
        )
      );

      toast.info(
        "Book unpublished successfully!"
      );
    } catch (error) {
      console.error(
        "Unpublish book error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to unpublish book!"
      );
    } finally {
      setActionId(null);
    }
  };

  // =====================================================
  // DELETE BOOK
  // =====================================================

  const handleDelete = async (
    bookId
  ) => {
    if (!bookId) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this book?"
      );

    if (!confirmed) return;

    try {
      setActionId(bookId);

      await axiosPublic.delete(
        `/admin/books/${bookId}`
      );

      setBooks((prev) =>
        prev.filter(
          (book) => book._id !== bookId
        )
      );

      toast.success(
        "Book deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete book error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete book!"
      );
    } finally {
      setActionId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">

        <div className="flex flex-col items-center gap-3">

          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />

          <p className="text-xs theme-text-secondary">
            Loading books...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h1 className="text-xl md:text-2xl font-bold theme-text-primary flex items-center gap-2">

              <BookOpen className="w-6 h-6 text-amber-500" />

              Book Approval & Management

            </h1>

            <p className="text-xs theme-text-secondary mt-1">
              Review, approve, unpublish, or remove
              books from the library.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchBooks}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="theme-bg-card border theme-border rounded-2xl p-4">

          <p className="text-xs theme-text-secondary">
            Total Books
          </p>

          <p className="text-2xl font-bold theme-text-primary mt-1">
            {books.length}
          </p>

        </div>

        <div className="theme-bg-card border theme-border rounded-2xl p-4">

          <p className="text-xs theme-text-secondary">
            Pending Approval
          </p>

          <p className="text-2xl font-bold text-amber-500 mt-1">
            {
              books.filter(
                (book) =>
                  book.status ===
                  "Pending Approval"
              ).length
            }
          </p>

        </div>

        <div className="theme-bg-card border theme-border rounded-2xl p-4">

          <p className="text-xs theme-text-secondary">
            Published
          </p>

          <p className="text-2xl font-bold text-emerald-500 mt-1">
            {
              books.filter(
                (book) =>
                  book.status ===
                  "Published"
              ).length
            }
          </p>

        </div>

      </div>

      {/* Book Table */}

      <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left text-xs md:text-sm">

            <thead>

              <tr className="border-b theme-border theme-text-secondary">

                <th className="py-3 px-2">
                  Book
                </th>

                <th className="py-3 px-2">
                  Author
                </th>

                <th className="py-3 px-2">
                  Category
                </th>

                <th className="py-3 px-2">
                  Owner
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
                    colSpan="6"
                    className="py-10 text-center theme-text-secondary"
                  >
                    No books found in the system.
                  </td>

                </tr>
              ) : (
                books.map((book) => {

                  const isUpdating =
                    actionId === book._id;

                  return (
                    <tr
                      key={book._id}
                      className="hover:bg-amber-500/5 transition-colors"
                    >

                      {/* Book */}

                      <td className="py-4 px-2">

                        <div className="font-semibold theme-text-primary">
                          {book.title ||
                            "Untitled Book"}
                        </div>

                        {book._id && (
                          <div className="text-[9px] text-slate-500 mt-1 font-mono">
                            ID:{" "}
                            {book._id}
                          </div>
                        )}

                      </td>

                      {/* Author */}

                      <td className="py-4 px-2 theme-text-secondary">
                        {book.author ||
                          "Unknown Author"}
                      </td>

                      {/* Category */}

                      <td className="py-4 px-2 theme-text-secondary">
                        {book.category ||
                          "N/A"}
                      </td>

                      {/* Owner */}

                      <td className="py-4 px-2">

                        {book.owner ? (
                          <div className="flex items-center gap-2">

                            {book.owner
                              .photoURL ? (
                              <img
                                src={
                                  book
                                    .owner
                                    .photoURL
                                }
                                alt={
                                  book
                                    .owner
                                    .name ||
                                  "Owner"
                                }
                                className="w-7 h-7 rounded-full object-cover border theme-border"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <User className="w-3.5 h-3.5" />
                              </div>
                            )}

                            <div>

                              <p className="text-xs font-semibold theme-text-primary">
                                {book.owner
                                  .name ||
                                  "Unknown"}
                              </p>

                              <p className="text-[9px] theme-text-secondary">
                                {book.owner
                                  .email ||
                                  "N/A"}
                              </p>

                            </div>

                          </div>
                        ) : (
                          <span className="theme-text-secondary">
                            N/A
                          </span>
                        )}

                      </td>

                      {/* Status */}

                      <td className="py-4 px-2">

                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                            book.status ===
                            "Published"
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
                          {book.status ||
                            "Unknown"}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="py-4 px-2 text-right">

                        {isUpdating ? (
                          <Loader2 className="inline-block w-4 h-4 animate-spin text-amber-500" />
                        ) : (
                          <div className="inline-flex items-center gap-2">

                            {/* Approve */}

                            {book.status ===
                              "Pending Approval" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleApprove(
                                    book._id
                                  )
                                }
                                className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
                                title="Approve & Publish"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {/* Unpublish */}

                            {book.status ===
                              "Published" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUnpublish(
                                    book._id
                                  )
                                }
                                className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20 transition-colors"
                                title="Force Unpublish"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  book._id
                                )
                              }
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors"
                              title="Delete Book"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        )}

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