"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import api from "../utils/axios.utils";
import AvatarSection from "../components/AvatarSection";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function Settings() {
  const { user, loading, setUser } = useAuth();
  const hasInitialized = useRef(false);

  // PROFILE STATE
  const [profileData, setProfileData] = useState({
    fullname: "",
    username: "",
    email: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // INIT FORM DATA
  useEffect(() => {
    if (user && !hasInitialized.current) {
      setProfileData({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
      });
      hasInitialized.current = true;
    }
  }, [user]);

  // PROFILE UPDATE
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const res = await api.patch("/api/v1/user/settings", {
        fullname: profileData.fullname,
        username: profileData.username,
      });

      toast.success("Profile updated successfully", { id: toastId });
      setUser(res.data.data);
    } catch (err) {
      toast.error("Failed to update profile", { id: toastId });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) return <span className="loading loading-bars loading-md"></span>;
  
  if (!user) return <div className="py-20 text-center">Not authenticated</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 animate-fade-in-up">
      
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-base-content/60 hover:text-base-content transition mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">Account Settings</h1>
        <p className="text-base-content/60 mt-1 text-sm sm:text-base">
          Manage your profile and security settings.
        </p>
      </div>

      <div className="card bg-base-200/70 backdrop-blur-xl border border-base-300/60 shadow-xl">
        {/* 2. PADDING FIX: p-4 on mobile, p-8 on desktop */}
        <div className="card-body p-4 sm:p-8 space-y-8">
          
          {/* PROFILE FORM */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h2 className="text-lg sm:text-xl font-medium">Profile</h2>

            <AvatarSection />

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {["fullname", "username"].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-sm text-base-content/70 capitalize font-medium ml-1">
                    {field}
                  </label>
                  <input
                    value={profileData[field]}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        [field]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-3 bg-base-300/60 border border-base-300
                               focus:outline-none
                               focus:ring-2 focus:ring-indigo-500/40
                               focus:border-indigo-500/60
                               transition"
                  />
                </div>
              ))}

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-base-content/70 font-medium ml-1 cursor-not-allowed">
                  Email
                </label>
                <input
                  value={profileData.email}
                  disabled
                  className="w-full rounded-lg px-4 py-3 bg-base-300/40 border border-base-300 opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={savingProfile}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600
                               shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                               hover:scale-[1.02] active:scale-[0.98]
                               transition-all duration-300"
              >
                {savingProfile ? (
                  <span className="loading loading-bars loading-sm"></span>
                ) : (
                  "Save Profile"
                )}
              </button>
            </div>

            {/* 3. RESPONSIVE SECURITY SECTION */}
            <div className="mt-8 bg-base-100 rounded-xl p-4 sm:p-6 shadow-sm border border-base-300">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                
                {/* Icon & Text Group */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Security</h3>
                    <p className="text-sm text-base-content/60">
                      Change password or delete account
                    </p>
                  </div>
                </div>

                {/* Button (Full width on mobile, auto on desktop) */}
                <Link
                  href="/security"
                  className="w-full sm:w-auto text-center px-5 py-2 rounded-lg text-sm font-medium
                             bg-base-200 border border-base-300 hover:bg-base-300
                             transition"
                >
                  Manage Settings
                </Link>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}