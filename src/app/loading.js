export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-6">
      {/* Animated Spinner with Theme Colors */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute w-10 h-10 border-4 border-secondary/20 border-b-secondary rounded-full animate-spin border-dashed"></div>
      </div>

      {/* Text Message */}
      <div className="text-center">
        <p className="text-lg font-bold text-secondary dark:text-primary tracking-wide animate-pulse">
          Loading BiblioDrop...
        </p>
        <p className="text-xs text-base-content/60 mt-1">
          Fetching books from local libraries...
        </p>
      </div>

      {/* Skeleton Card Preview Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 opacity-40">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col gap-4 p-4 border border-base-300 rounded-xl bg-base-200 animate-pulse">
            <div className="h-48 w-full bg-base-300 rounded-lg"></div>
            <div className="h-6 w-3/4 bg-base-300 rounded"></div>
            <div className="h-4 w-1/2 bg-base-300 rounded"></div>
            <div className="h-10 w-full bg-base-300 rounded-lg mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}