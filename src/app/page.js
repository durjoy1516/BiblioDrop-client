import Link from "next/link";
import { ArrowRight, CheckCircle2, Truck } from "lucide-react";

export default function Home() {
  // TODO: MongoDB থেকে ডাটা ফেচ করার পর এই array-তে ডাটা বসানো হবে
  const featuredBooks = []; 

  return (
    <div className="min-h-screen bg-[#1C1917] text-gray-100">
      {/* Hero Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Seamless Doorstep Book Borrowing
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Your Local Library, <br />
              <span className="text-amber-400">Delivered Right To You.</span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
              Explore thousands of books from neighborhood libraries and independent book owners. Request doorstep delivery with verified status tracking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/books"
                className="bg-amber-500 hover:bg-amber-400 text-[#1C1917] font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                Browse Books <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Become a Librarian
              </Link>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#2A241E] p-6 rounded-2xl border border-amber-500/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Fast Doorstep Delivery</h3>
                  <p className="text-xs text-gray-400">Powered by Stripe payment</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                Active
              </span>
            </div>

            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center justify-between">
                <span>1. Browse Local Listings</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </li>
              <li className="flex items-center justify-between">
                <span>2. Pay Delivery Fee ($)</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </li>
              <li className="flex items-center justify-between">
                <span>3. Track & Read at Home</span>
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Books Section (Dynamic Section Prepared) */}
      <section className="py-12 bg-[#12100E] border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Books</h2>
              <p className="text-sm text-gray-400">Popular books available for instant request</p>
            </div>
            <Link href="/books" className="text-amber-400 hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>

          {featuredBooks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-amber-500/20 rounded-xl bg-[#1C1917]/50">
              <p className="text-gray-400 text-sm">No books available right now.</p>
              <p className="text-xs text-amber-400/80 mt-1">Data will be fetched dynamically from MongoDB database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* MongoDB Data maping will go here */}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}