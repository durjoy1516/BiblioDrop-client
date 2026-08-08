export default function SkeletonCard() {
  return (
    <div className="theme-bg-card border theme-border rounded-2xl p-4 animate-pulse space-y-4">
      {/* Cover Image Skeleton */}
      <div className="w-full h-52 bg-amber-500/10 rounded-xl"></div>
      
      {/* Category Badge Skeleton */}
      <div className="h-4 w-20 bg-amber-500/10 rounded-full"></div>
      
      {/* Title & Author Skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-amber-500/10 rounded"></div>
        <div className="h-4 w-1/2 bg-amber-500/10 rounded"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="pt-2 border-t theme-border flex items-center justify-between">
        <div className="h-4 w-16 bg-amber-500/10 rounded"></div>
        <div className="h-8 w-20 bg-amber-500/10 rounded-lg"></div>
      </div>
    </div>
  );
}