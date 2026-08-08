"use client";

import Image from "next/image";
import { Award, CheckCircle } from "lucide-react";

const librarians = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    completedDeliveries: 142,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Robert Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    completedDeliveries: 118,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Emily Watson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
    completedDeliveries: 95,
    rating: 4.9,
  },
];

export default function TopLibrarians() {
  return (
    <section className="py-16 theme-bg-section border-t theme-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border theme-border text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
            <Award className="w-4 h-4" /> Top Verified Providers
          </div>
          <h2 className="text-3xl font-extrabold theme-text-primary">Top Librarians</h2>
          <p className="text-sm theme-text-secondary mt-2">Recognizing our providers with the most successful deliveries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {librarians.map((lib) => (
            <div
              key={lib.id}
              className="theme-bg-card border theme-border p-6 rounded-2xl shadow-lg text-center flex flex-col items-center relative overflow-hidden"
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-amber-500">
                <Image src={lib.avatar} alt={lib.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-bold theme-text-primary flex items-center gap-1.5">
                {lib.name} <CheckCircle className="w-4 h-4 text-emerald-500" />
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                ⭐ {lib.rating} / 5.0 Rating
              </p>
              <div className="mt-4 pt-4 border-t theme-border w-full flex justify-between text-xs theme-text-secondary">
                <span>Completed Deliveries:</span>
                <span className="font-bold theme-text-primary">{lib.completedDeliveries}+</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}