"use client";

import Link from "next/link";
import { Book, GraduationCap, Cpu, Theater, Heart, Atom } from "lucide-react";

const categories = [
  { name: "Fiction", icon: Book, count: "120+ Books" },
  { name: "Sci-Fi", icon: Cpu, count: "80+ Books" },
  { name: "Academic", icon: GraduationCap, count: "200+ Books" },
  { name: "Drama", icon: Theater, count: "50+ Books" },
  { name: "Romance", icon: Heart, count: "90+ Books" },
  { name: "Science", icon: Atom, count: "110+ Books" },
];

export default function PopularCategories() {
  return (
    <section className="py-16 theme-bg-main border-t theme-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold theme-text-primary">Popular Categories</h2>
          <p className="text-sm theme-text-secondary mt-2">Find your favorite genre and start reading today</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={`/books?category=${encodeURIComponent(cat.name)}`}
                className="group theme-bg-card border theme-border p-6 rounded-2xl text-center hover:border-amber-500 hover:-translate-y-1 transition-all duration-300 shadow-md flex flex-col items-center justify-center"
              >
                <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold theme-text-primary text-base">{cat.name}</h3>
                <p className="text-xs theme-text-secondary mt-1">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}