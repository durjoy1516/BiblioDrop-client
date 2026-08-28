"use client";

import { BarChart3, TrendingUp } from "lucide-react";

export default function Charts({ deliveries = [] }) {
  const now = new Date();

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (5 - index),
      1
    );

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    const monthNumber = date.getMonth();
    const year = date.getFullYear();

    const count = deliveries.filter((delivery) => {
      if (!delivery?.createdAt) return false;

      const deliveryDate = new Date(delivery.createdAt);

      return (
        deliveryDate.getMonth() === monthNumber &&
        deliveryDate.getFullYear() === year
      );
    }).length;

    return {
      month,
      count,
    };
  });

  const maxCount = Math.max(
    ...monthlyData.map((item) => item.count),
    1
  );

  const totalActivity = monthlyData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <div className="theme-bg-card border theme-border rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b theme-border pb-4">
        <div>
          <h3 className="text-base font-bold theme-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            Borrowing Activity Analytics
          </h3>

          <p className="text-xs theme-text-secondary mt-1">
            Your delivery activity over the last 6 months
          </p>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 w-fit">
          <TrendingUp className="w-3 h-3" />
          {totalActivity} Total
        </span>
      </div>

      <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
        {monthlyData.map((item) => {
          const heightPercent =
            item.count === 0
              ? 4
              : Math.max((item.count / maxCount) * 100, 8);

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
            >
              <span className="text-[10px] font-bold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </span>

              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full bg-amber-500/20 group-hover:bg-amber-500 rounded-t-xl transition-all duration-300 relative"
                title={`${item.month}: ${item.count} deliveries`}
              />

              <span className="text-xs font-medium theme-text-secondary">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}