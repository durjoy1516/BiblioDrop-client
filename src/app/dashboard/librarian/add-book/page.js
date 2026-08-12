"use client";

import { useState } from "react";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2 } from "lucide-react";

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    deliveryFee: "",
    description: "",
    image: "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgData = new FormData();
    imgData.append("image", file);

    try {
      setLoading(true);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: imgData,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.display_url }));
        toast.success("Cover image uploaded!");
      }
    } catch (err) {
      toast.error("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Please upload a book cover image");

    try {
      setLoading(true);
      await axiosPublic.post("/librarian/books", formData);
      toast.success("Book submitted! Strictly set to Pending Approval.");
      router.push("/dashboard/librarian/inventory");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto theme-bg-card border theme-border p-8 rounded-3xl space-y-6 shadow-xl">
      <h1 className="text-xl font-bold theme-text-primary flex items-center gap-2">
        <PlusCircle className="w-6 h-6 text-amber-500" /> Add New Book Listing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
        <div>
          <label className="block theme-text-secondary mb-1">Book Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-transparent border theme-border rounded-xl px-4 py-2.5 theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block theme-text-secondary mb-1">Author Name</label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-transparent border theme-border rounded-xl px-4 py-2.5 theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block theme-text-secondary mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-transparent border theme-border rounded-xl px-4 py-2.5 theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Fiction" className="bg-slate-900 text-white">Fiction</option>
              <option value="Sci-Fi" className="bg-slate-900 text-white">Sci-Fi</option>
              <option value="Academic" className="bg-slate-900 text-white">Academic</option>
              <option value="Biography" className="bg-slate-900 text-white">Biography</option>
              <option value="History" className="bg-slate-900 text-white">History</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block theme-text-secondary mb-1">Delivery Fee ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.deliveryFee}
            onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
            className="w-full bg-transparent border theme-border rounded-xl px-4 py-2.5 theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block theme-text-secondary mb-1">Cover Image (ImgBB)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full bg-transparent border theme-border rounded-xl px-4 py-2 theme-text-secondary focus:outline-none"
          />
          {formData.image && <p className="text-emerald-500 text-xs mt-1">Image uploaded successfully!</p>}
        </div>

        <div>
          <label className="block theme-text-secondary mb-1">Description</label>
          <textarea
            rows="4"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-transparent border theme-border rounded-xl px-4 py-2.5 theme-text-primary focus:outline-none focus:ring-1 focus:ring-amber-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Book"}
        </button>
      </form>
    </div>
  );
}