"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserCheck, ArrowLeft } from "lucide-react";
import axiosPublic from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
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
        toast.success("Account created successfully! Please login.");
        router.push("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up Handler (সংশোধিত)
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const res = await axiosPublic.post("/auth/google", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: formData.role, // Selected role
      });

      const userData = res.data.user || res.data;
      login(userData);
      router.push(
        formData.role === "librarian"
          ? "/dashboard/librarian"
          : "/dashboard/user"
      );
    } catch (err) {
      console.error("Google Signup Error:", err.code, err.message);

      if (err.code === "auth/popup-closed-by-user") {
        toast.info("Sign-up cancelled");
      } else if (err.code === "auth/unauthorized-domain") {
        toast.error("Domain is not authorized in Firebase Console!");
      } else {
        const backendMessage = err.response?.data?.message;
        toast.error(backendMessage || "Google Sign-Up failed!");
      }
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
          <h2 className="text-3xl font-extrabold theme-text-primary">
            Create Account
          </h2>
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
            <label className="text-xs font-semibold theme-text-primary">
              Full Name
            </label>
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
            <label className="text-xs font-semibold theme-text-primary">
              Email Address
            </label>
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
            <label className="text-xs font-semibold theme-text-primary">
              Password
            </label>
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
            <label className="text-xs font-semibold theme-text-primary">
              Account Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="user" className="theme-bg-card">
                General Reader
              </option>
              <option value="librarian" className="theme-bg-card">
                Librarian / Book Owner
              </option>
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

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t theme-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="theme-bg-card px-2 theme-text-secondary">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          type="button"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 border theme-border hover:bg-amber-500/10 theme-text-primary font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="text-center pt-2 border-t theme-border">
          <p className="text-xs theme-text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}