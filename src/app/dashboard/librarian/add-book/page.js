"use client";

import { useState } from "react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2 } from "lucide-react";

const CATEGORIES = [
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

export default function AddBookPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    deliveryFee: "",
    description: "",
    coverImage: "",
  });

  // =========================
  // Image Upload
  // =========================
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imgData = new FormData();
    imgData.append("image", file);

    try {
      setLoading(true);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imgData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error("Image upload failed");
      }

      setFormData((prev) => ({
        ...prev,
        coverImage: data.data.display_url,
      }));

      toast.success("Cover image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Input Handler
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coverImage) {
      toast.error("Please upload a book cover image.");
      return;
    }

    if (Number(formData.deliveryFee) <= 0) {
      toast.error("Delivery fee must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        deliveryFee: Number(formData.deliveryFee),
        description: formData.description.trim(),
        coverImage: formData.coverImage,
      };

      const res = await axiosPublic.post("/books", payload);

      if (res.data?.success) {
        toast.success(
          res.data.message || "Book submitted for admin approval!"
        );

        router.push("/dashboard/librarian/inventory");
        router.refresh();
      } else {
        toast.error("Failed to add book.");
      }
    } catch (error) {
      console.error("Add book error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to add book. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="theme-bg-card border theme-border p-6 md:p-8 rounded-3xl shadow-xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold theme-text-primary flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-amber-500" />
            Add New Book Listing
          </h1>

          <p className="text-xs theme-text-secondary mt-1">
            Submit a new book for admin approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block theme-text-secondary text-xs font-medium mb-1.5">
              Book Title
            </label>

            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className="w-full bg-transparent border theme-border rounded-xl px-4 py-3 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Author + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Author */}
            <div>
              <label className="block theme-text-secondary text-xs font-medium mb-1.5">
                Author Name
              </label>

              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full bg-transparent border theme-border rounded-xl px-4 py-3 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block theme-text-secondary text-xs font-medium mb-1.5">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-transparent border theme-border rounded-xl px-4 py-3 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-slate-900 text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery Fee */}
          <div>
            <label className="block theme-text-secondary text-xs font-medium mb-1.5">
              Delivery Fee ($)
            </label>

            <input
              type="number"
              name="deliveryFee"
              min="0.01"
              step="0.01"
              required
              value={formData.deliveryFee}
              onChange={handleChange}
              placeholder="5.00"
              className="w-full bg-transparent border theme-border rounded-xl px-4 py-3 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block theme-text-secondary text-xs font-medium mb-1.5">
              Cover Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              className="w-full bg-transparent border theme-border rounded-xl px-4 py-3 text-sm theme-text-secondary focus:outline-none"
            />

            {formData.coverImage && (
              <div className="mt-3">
                <img
                  src={formData.coverImage}
                  alt="Book cover preview"
                  className="w-24 h-32 object-cover rounded-lg border theme-border"
                />

                <p className="text-xs text-emerald-500 mt-2">
                  ✓ Image uploaded successfully
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block theme-text-secondary text-xs font-medium mb-1.5">
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description of the book..."
              className="w-full bg-transparent border theme-border rounded-xl px-4 py-3 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Submit Book
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}