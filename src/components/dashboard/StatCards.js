"use client";

import { BookOpen, BookMarked, Users, Clock, CheckCircle2 } from "lucide-react";

export default function StatCards({ stats, role = "user" }) {
  // Dynamic stat items based on user role
  const getCards = () => {
    if (role === "admin") {
      return [
        { label: "Total Users", value: stats?.totalUsers || 142, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Total Books", value: stats?.totalBooks || 320, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Rentals", value: stats?.activeRentals || 45, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      ];
    }
    
    if (role === "librarian") {
      return [
        { label: "My Books", value: stats?.myBooks || 18, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Active Rentals", value: stats?.activeRentals || 5, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Returned Books", value: stats?.returned || 12, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      ];
    }

    // Default User Cards
    return [
      { label: "Total Borrowed", value: stats?.totalBorrowed || 4, icon: BookMarked, color: "text-amber-500", bg: "bg-amber-500/10" },
      { label: "Currently Reading", value: stats?.activeLoans || 2, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Returned", value: stats?.returnedBooks || 2, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];
  };

  const cards = getCards();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="theme-bg-card border theme-border p-5 rounded-2xl shadow-md flex items-center gap-4 hover:border-amber-500/30 transition-all"
          >
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs theme-text-secondary font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold theme-text-primary mt-0.5">{card.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}