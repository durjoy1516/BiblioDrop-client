import Link from "next/link";
import { BookX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-6 bg-primary/10 rounded-full text-primary mb-4 animate-bounce">
        <BookX className="w-20 h-20" />
      </div>
      <h1 className="text-6xl font-extrabold text-secondary dark:text-primary mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-base-content/70 max-w-md mb-6">
        Sorry, the book shelf or page you are looking for doesn't exist or has been moved to another section.
      </p>
      <Link
        href="/"
        className="btn btn-primary text-primary-content font-bold flex items-center gap-2 shadow-lg"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}