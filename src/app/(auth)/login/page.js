// ```jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import axiosPublic from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }
  };

  // =====================================================
  // ROLE BASED REDIRECT
  // =====================================================

  const handleRoleRedirect = (user) => {
    if (user?.role === "admin") {
      router.push("/dashboard/admin");
    } else if (user?.role === "librarian") {
      router.push("/dashboard/librarian");
    } else {
      router.push("/dashboard/user");
    }
  };

  // =====================================================
  // EMAIL / PASSWORD LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axiosPublic.post(
        "/auth/login",
        formData
      );

      const userData =
        res.data?.user || res.data;

      const token =
        res.data?.token ||
        res.data?.accessToken;

      if (!userData) {
        throw new Error(
          "User information was not returned."
        );
      }

      // Save user + token
      // Backend cookie will also be handled automatically
      // because axios uses withCredentials: true.
      login(userData, token);

      handleRoleRedirect(userData);
    } catch (err) {
      // 401 means wrong email/password.
      // This is an expected authentication response,
      // so we don't log it as a console error.

      if (err.response?.status === 401) {
        const message =
          err.response?.data?.message ||
          "Invalid email or password.";

        setError(message);
        return;
      }

      // Other API errors
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const provider =
      new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      // Open Google popup
      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const firebaseUser =
        result.user;

      // Send Google user information to backend
      const res =
        await axiosPublic.post(
          "/auth/google",
          {
            name:
              firebaseUser.displayName,
            email:
              firebaseUser.email,
            photoURL:
              firebaseUser.photoURL,
            role: "user",
          }
        );

      const userData =
        res.data?.user ||
        res.data;

      const token =
        res.data?.token ||
        res.data?.accessToken;

      if (!userData) {
        throw new Error(
          "User information was not returned."
        );
      }

      // Save user + token
      login(userData, token);

      // Redirect based on role
      handleRoleRedirect(userData);
    } catch (err) {
      // =================================================
      // GOOGLE POPUP CLOSED
      // =================================================
      // This is NOT a real error.
      // User simply cancelled the Google login popup.

      if (
        err.code ===
        "auth/popup-closed-by-user"
      ) {
        toast.info(
          "Sign-in cancelled."
        );
        return;
      }

      // =================================================
      // UNAUTHORIZED DOMAIN
      // =================================================

      if (
        err.code ===
        "auth/unauthorized-domain"
      ) {
        toast.error(
          "This domain is not authorized in Firebase Console."
        );
        return;
      }

      // =================================================
      // OTHER GOOGLE / BACKEND ERRORS
      // =================================================

      console.error(
        "Google Login Error:",
        err
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;

      toast.error(
        backendMessage ||
          err.message ||
          "Google Sign-In failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen theme-bg-main flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="max-w-md w-full theme-bg-card border theme-border rounded-3xl p-8 shadow-2xl space-y-6"
      >
        {/* Header */}

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs theme-text-secondary hover:text-amber-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          <h2 className="text-3xl font-extrabold theme-text-primary">
            Welcome Back
          </h2>

          <p className="text-xs theme-text-secondary mt-1">
            Sign in to access your library
            account and delivery status.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        {/* Email Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Email */}

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
                autoComplete="email"
                placeholder="reader@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Password */}

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
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t theme-border" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="theme-bg-card px-2 theme-text-secondary">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 border theme-border hover:bg-amber-500/10 theme-text-primary font-semibold py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
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

          Sign in with Google
        </button>

        {/* Register Link */}

        <div className="text-center pt-2 border-t theme-border">
          <p className="text-xs theme-text-secondary">
            Don't have an account?{" "}

            <Link
              href="/register"
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Create One
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
// ```
