"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

import axiosPublic from "@/lib/axios";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // RESTORE SESSION
  // =====================================================

  useEffect(() => {
    const restoreSession =
      async () => {
        try {
          // =================================================
          // First restore user from localStorage
          // =================================================

          const storedUser =
            localStorage.getItem(
              "user"
            );

          if (storedUser) {
            try {
              const parsedUser =
                JSON.parse(
                  storedUser
                );

              setUser(
                parsedUser
              );
            } catch {
              localStorage.removeItem(
                "user"
              );
            }
          }

          // =================================================
          // Verify session with backend
          //
          // axios interceptor will automatically attach
          // the JWT from localStorage if available.
          // =================================================

          try {
            const res =
              await axiosPublic.get(
                "/auth/me"
              );

            if (
              res.data?.user
            ) {
              setUser(
                res.data.user
              );

              localStorage.setItem(
                "user",
                JSON.stringify(
                  res.data.user
                )
              );
            }
          } catch (error) {
            console.warn(
              "Session verification failed:",
              error.response
                ?.data?.message ||
                error.message
            );

            // Don't immediately remove local user.
            // The backend session may fail temporarily
            // while the local authentication state is valid.
          }
        } catch (error) {
          console.error(
            "Failed to restore user session:",
            error
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "accessToken"
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    restoreSession();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = (
    userData,
    token = null
  ) => {
    if (!userData) {
      return;
    }

    // =================================================
    // Save user
    // =================================================

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(
        userData
      )
    );

    // =================================================
    // Save JWT token
    // =================================================

    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    }

    toast.success(
      "Successfully logged in!"
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      await axiosPublic.post(
        "/auth/logout"
      );
    } catch (error) {
      console.warn(
        "Backend logout failed:",
        error.response
          ?.data?.message ||
          error.message
      );
    } finally {
      setUser(null);

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "accessToken"
      );

      toast.info(
        "Logged out successfully!"
      );
    }
  };

  // =====================================================
  // CONTEXT
  // =====================================================

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

// =====================================================
// USE AUTH
// =====================================================

export const useAuth =
  () => {
    const context =
      useContext(
        AuthContext
      );

    if (!context) {
      throw new Error(
        "useAuth must be used inside an AuthProvider"
      );
    }

    return context;
  };