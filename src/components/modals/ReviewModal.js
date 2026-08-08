"use client";

import { useState } from "react";
import { X, Star, MessageSquare } from "lucide-react";

export default function ReviewModal({ isOpen, onClose, bookTitle = "Book Title" }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md theme-bg-card border theme-border p-6 rounded-3xl shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-500/10 theme-text-secondary hover:text-amber-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold">
            <MessageSquare className="w-3.5 h-3.5" /> Book Review
          </div>
          <h2 className="text-xl font-bold theme-text-primary">Rate & Review</h2>
          <p className="text-xs theme-text-secondary">Share your feedback for <span className="font-semibold theme-text-primary">{bookTitle}</span></p>
        </div>

        {/* Star Rating Select */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-amber-500 transition-transform hover:scale-125"
            >
              <Star
                className={`w-7 h-7 ${
                  star <= (hoverRating || rating) ? "fill-amber-500 text-amber-500" : "text-slate-600"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium theme-text-secondary">Your Review</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of the book's quality, story, or condition?"
              className="w-full p-3 rounded-xl text-xs border theme-border bg-amber-500/5 theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>

      </div>
    </div>
  );
}