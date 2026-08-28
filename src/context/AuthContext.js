"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import axiosPublic from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user after page reload
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }

        // Verify the current session with backend
        try {
          const res = await axiosPublic.get("/auth/me");

          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem(
              "user",
              JSON.stringify(res.data.user)
            );
          }
        } catch (error) {
          // If backend session verification fails,
          // keep local user only if a token exists.
          console.warn(
            "Session verification failed:",
            error.response?.data?.message || error.message
          );
        }
      } catch (error) {
        console.error("Failed to restore user session:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login
  const login = (userData, token = null) => {
    if (!userData) return;

    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));

    // Save token if backend sends one
    if (token) {
      localStorage.setItem("token", token);
    }

    toast.success("Successfully logged in!");
  };

  // Logout
  const logout = async () => {
    try {
      // Tell backend to destroy/clear the session cookie
      await axiosPublic.post("/auth/logout");
    } catch (error) {
      console.warn(
        "Backend logout failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setUser(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");

      toast.info("Logged out successfully!");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};