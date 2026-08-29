// ```jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  UserCheck,
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

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error while typing
    if (error) {
      setError("");
    }
  };

  // =====================================================
  // EMAIL / PASSWORD REGISTRATION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    // Confirm password validation
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Do not send confirmPassword to backend
      const {
        confirmPassword,
        ...registrationData
      } = formData;

      const res = await axiosPublic.post(
        "/auth/register",
        registrationData
      );

      if (
        res.data?.success ||
        res.status === 201
      ) {
        toast.success(
          "Account created successfully! Please login."
        );

        router.push("/login");
        return;
      }

      setError(
        res.data?.message ||
          "Registration failed. Please try again."
      );
    } catch (err) {
      console.error(
        "Registration Error:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE SIGNUP
  // =====================================================

  const handleGoogleSignup = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    const provider =
      new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      // Firebase Google popup
      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const firebaseUser =
        result.user;

      if (!firebaseUser.email) {
        throw new Error(
          "Google account does not have an email."
        );
      }

      // Send Google user to backend
      const res =
        await axiosPublic.post(
          "/auth/google",
          {
            name:
              firebaseUser.displayName ||
              "Google User",

            email:
              firebaseUser.email,

            photoURL:
              firebaseUser.photoURL ||
              "",

            role: formData.role,
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
          "Invalid user data received from server."
        );
      }

      // Save authentication state
      login(userData, token);

      toast.success(
        "Google account connected successfully!"
      );

      // Role based redirect
      if (
        userData.role ===
        "admin"
      ) {
        router.push(
          "/dashboard/admin"
        );
      } else if (
        userData.role ===
        "librarian"
      ) {
        router.push(
          "/dashboard/librarian"
        );
      } else {
        router.push(
          "/dashboard/user"
        );
      }
    } catch (err) {
      // =================================================
      // IMPORTANT:
      // Popup closed is NOT a real application error.
      // User simply cancelled Google login.
      // =================================================

      if (
        err?.code ===
        "auth/popup-closed-by-user"
      ) {
        toast.info(
          "Google sign-up cancelled."
        );

        return;
      }

      // Firebase popup blocked
      if (
        err?.code ===
        "auth/popup-blocked"
      ) {
        toast.error(
          "Google popup was blocked. Please allow popups and try again."
        );

        return;
      }

      // Firebase unauthorized domain
      if (
        err?.code ===
        "auth/unauthorized-domain"
      ) {
        toast.error(
          "This domain is not authorized in Firebase Console."
        );

        return;
      }

      // Firebase account exists with another credential
      if (
        err?.code ===
        "auth/account-exists-with-different-credential"
      ) {
        toast.error(
          "An account already exists with this email. Please use the original login method."
        );

        return;
      }

      // Backend / other errors
      console.error(
        "Google Signup Error:",
        err
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      toast.error(
        backendMessage ||
          "Google Sign-Up failed. Please try again."
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

        {/* ================= HEADER ================= */}

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs theme-text-secondary hover:text-amber-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />

            Back to Home
          </Link>

          <h2 className="text-3xl font-extrabold theme-text-primary">
            Create Account
          </h2>

          <p className="text-xs theme-text-secondary mt-1">
            Join BiblioDrop as a Reader or
            Librarian Provider.
          </p>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        {/* ================= REGISTRATION FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* NAME */}

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
                autoComplete="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              />

            </div>
          </div>

          {/* EMAIL */}

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
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              />

            </div>
          </div>

          {/* PASSWORD */}

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
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              />

            </div>

            <p className="text-[11px] theme-text-secondary">
              Minimum 6 characters.
            </p>
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="space-y-1">

            <label className="text-xs font-semibold theme-text-primary">
              Confirm Password
            </label>

            <div className="relative">

              <Lock className="w-4 h-4 absolute left-3 top-3.5 theme-text-secondary" />

              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              />

            </div>
          </div>

          {/* ROLE */}

          <div className="space-y-1">

            <label className="text-xs font-semibold theme-text-primary">
              Account Type
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-xl border theme-border bg-amber-500/5 text-sm theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
            >

              <option
                value="user"
                className="theme-bg-card"
              >
                General Reader
              </option>

              <option
                value="librarian"
                className="theme-bg-card"
              >
                Librarian / Book Owner
              </option>

            </select>
          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {loading ? (
              "Creating Account..."
            ) : (
              <>
                <UserCheck className="w-4 h-4" />

                Register Now
              </>
            )}

          </button>

        </form>

        {/* ================= DIVIDER ================= */}

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

        {/* ================= GOOGLE SIGNUP ================= */}

        <button
          onClick={handleGoogleSignup}
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

          Sign up with Google

        </button>

        {/* ================= LOGIN LINK ================= */}

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
// ```
