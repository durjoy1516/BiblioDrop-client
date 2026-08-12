"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosPublic from "@/lib/axios";
import { toast } from "react-toastify";
import { User, Mail, Shield, Camera, Loader2, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  // Profile Update Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Backend API-তে প্রোফাইল আপডেটের রিকোয়েস্ট পাঠানো
      const res = await axiosPublic.patch("/auth/profile", {
        name,
        photoURL,
      });

      if (res.data) {
        // Auth Context এবং State আপডেট করা
        setUser((prev) => ({
          ...prev,
          name: res.data.user?.name || name,
          photoURL: res.data.user?.photoURL || photoURL,
        }));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile!");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="theme-bg-card border theme-border p-6 rounded-3xl shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold theme-text-primary">
            Account <span className="text-amber-500">Settings</span>
          </h1>
          <p className="text-xs md:text-sm theme-text-secondary mt-1">
            Manage your personal information and profile picture.
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-2xl text-xs font-bold uppercase flex items-center gap-2">
          <Shield className="w-4 h-4" /> {user?.role || "User"}
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="theme-bg-card border theme-border rounded-3xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          
          {/* Profile Picture Preview */}
          <div className="flex flex-col items-center sm:flex-row gap-6 border-b theme-border pb-6">
            <div className="relative">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-3xl uppercase border-2 border-amber-500 shadow-md">
                  {name ? name.charAt(0) : <User className="w-10 h-10" />}
                </div>
              )}
              <div className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-slate-950 rounded-full shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-lg font-bold theme-text-primary">{user?.name || "User Name"}</h3>
              <p className="text-xs theme-text-secondary">{user?.email}</p>
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase mt-1">
                {user?.role || "USER"}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 text-xs md:text-sm rounded-xl theme-bg-main border theme-border theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Email (Read Only) */}
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" /> Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 text-xs md:text-sm rounded-xl theme-bg-main border theme-border text-gray-400 cursor-not-allowed opacity-70"
              />
            </div>

            {/* Photo URL */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold theme-text-secondary flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-500" /> Profile Photo URL
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2.5 text-xs md:text-sm rounded-xl theme-bg-main border theme-border theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t theme-border">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs md:text-sm shadow-md hover:bg-amber-400 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}