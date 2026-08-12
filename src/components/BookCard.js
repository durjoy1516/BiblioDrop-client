import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";

export default function BookCard({ book }) {
  const isUnavailable = book?.status === "Checked Out" || book?.available === false;
  // Ensure valid ID fallback
  const bookId = book?._id || book?.id;

  return (
    <div className="group theme-bg-card border theme-border rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500 hover:shadow-lg transition-all duration-300 relative">
      {/* Cover Image & Badges */}
      <div>
        <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 bg-amber-500/5">
          <Image
            src={book?.coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400"}
            alt={book?.title || "Book Cover"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Unavailable Badge */}
          {isUnavailable && (
            <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
              Unavailable
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {book?.category || book?.genre || "General"}
          </div>
        </div>

        {/* Title & Author */}
        <h3 className="font-bold theme-text-primary text-base line-clamp-1 group-hover:text-amber-500 transition-colors">
          {book?.title || "Untitled Book"}
        </h3>
        <p className="text-xs theme-text-secondary mt-1 line-clamp-1">
          By {book?.author || "Unknown Author"}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-4 pt-3 border-t theme-border flex items-center justify-between">
        <div>
          <span className="text-[10px] theme-text-secondary uppercase tracking-wider block">Delivery Fee</span>
          <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
            ${book?.deliveryFee !== undefined ? book.deliveryFee : (book?.price || "5.00")}
          </span>
        </div>

        <Link
          href={`/books/${bookId}`}
          className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition-colors"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}