import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";

export default function BookCard({ book }) {
  const isUnavailable =
    book?.status === "Checked Out" ||
    book?.status === "Unavailable" ||
    book?.available === false;

  const bookId = book?._id || book?.id;

  const coverImage =
    book?.coverImage ||
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600";

  const category = book?.category || book?.genre || "General";

  const deliveryFee =
    book?.deliveryFee !== undefined && book?.deliveryFee !== null
      ? book.deliveryFee
      : book?.price !== undefined && book?.price !== null
      ? book.price
      : "5.00";

  return (
    <div className="group theme-bg-card border theme-border rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500 hover:shadow-lg transition-all duration-300 relative">
      {/* Book Cover */}
      <div>
        <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 bg-amber-500/5">
          <Image
            src={coverImage}
            alt={book?.title || "Book Cover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ${
              !isUnavailable ? "group-hover:scale-105" : ""
            }`}
          />

          {/* Availability Badge */}
          <div className="absolute top-2 right-2">
            {isUnavailable ? (
              <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow">
                Unavailable
              </span>
            ) : (
              <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow">
                Available
              </span>
            )}
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-medium px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {category}
          </div>
        </div>

        {/* Book Information */}
        <h3 className="font-bold theme-text-primary text-base line-clamp-1 group-hover:text-amber-500 transition-colors">
          {book?.title || "Untitled Book"}
        </h3>

        <p className="text-xs theme-text-secondary mt-1 line-clamp-1">
          By {book?.author || "Unknown Author"}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t theme-border flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] theme-text-secondary uppercase tracking-wider block">
            Delivery Fee
          </span>

          <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
            ${deliveryFee}
          </span>
        </div>

        {bookId ? (
          <Link
            href={`/books/${bookId}`}
            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 bg-slate-500/20 text-slate-400 font-bold text-xs px-3 py-2 rounded-lg cursor-not-allowed">
            Details
          </span>
        )}
      </div>
    </div>
  );
}