"use client";

import { BarChart3, TrendingUp } from "lucide-react";

export default function Charts() {
  // Sample monthly rental statistics
  const monthlyData = [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 25 },
    { month: "Apr", count: 32 },
    { month: "May", count: 20 },
    { month: "Jun", count: 40 },
  ];

  const maxCount = Math.max(...monthlyData.map((d) => d.count));

  return (
    <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b theme-border pb-4">
        <div>
          <h3 className="text-base font-bold theme-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" /> Borrowing Activity Analytics
          </h3>
          <p className="text-xs theme-text-secondary mt-0.5">Overview of book orders and rentals over the last 6 months</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +15% Growth
        </span>
      </div>

      {/* Bar Visual representation */}
      <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
        {monthlyData.map((item) => {
          const heightPercent = Math.round((item.count / maxCount) * 100);
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[10px] font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </span>
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full bg-amber-500/20 group-hover:bg-amber-500 rounded-t-xl transition-all duration-300 relative"
              />
              <span className="text-xs font-medium theme-text-secondary">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}