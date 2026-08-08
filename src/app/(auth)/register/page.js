"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserCheck, ArrowLeft } from "lucide-react";
import axiosPublic from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosPublic.post("/auth/register", formData);
      if (res.data.success || res.status === 201) {
        router.push("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg-main flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full theme-bg-card border theme-border rounded-3xl p-8 shadow-2xl space-y-6"
      >
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs theme-text-secondary hover:text-amber-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h2 className="text-3xl font-extrabold theme-text-primary">Create Account</h2>
          <p className="text-xs theme-text-secondary mt-1">
            Join BiblioDrop as a Reader or Librarian Provider.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold theme-text-primary">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5 theme-text-secondary" />
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold theme-text-primary">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 theme-text-secondary" />
              <input
                type="email"
                name="email"
                required
                placeholder="reader@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold theme-text-primary">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 theme-text-secondary" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold theme-text-primary">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="user" className="theme-bg-card">General Reader</option>
              <option value="librarian" className="theme-bg-card">Librarian / Book Owner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                <UserCheck className="w-4 h-4" /> Register Now
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t theme-border">
          <p className="text-xs theme-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}