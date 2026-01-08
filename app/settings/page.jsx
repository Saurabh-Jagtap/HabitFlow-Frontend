"use client"
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import api from "../utils/axios.utils";
import AvatarSection from "../components/AvatarSection";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, loading, setUser } = useAuth();
  const hasInitialized = useRef(false);
  const router = useRouter();

  //  PROFILE STATE
  const [profileData, setProfileData] = useState({
    fullname: "",
    username: "",
    email: "",
  });

  //  PASSWORD STATE
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  //   INIT FORM DATA
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

  //   PROFILE UPDATE
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    const toastId = toast.loading("Saving changes...")

    try {
      const res = await api.patch("/api/v1/user/settings", {
        fullname: profileData.fullname,
        username: profileData.username,
      });

      toast.success("Profile updated successfully", { id: toastId });
      setUser(res.data.data);
    } catch (err) {
      toast.error("Failed to update profile", { id: toastId })
    } finally {
      setSavingProfile(false);
    }
  };

  //   PASSWORD UPDATE
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword) {
      return alert("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setSavingPassword(true);

    const toastId = toast.loading("Updating password...")

    try {
      await api.patch("/api/v1/user/password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated. Please log in again.", { id: toastId })
      alert();
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      router.push('/login')
    } catch (err) {
      toast.error("Failed to update password", { id: toastId })
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <span className="loading loading-bars loading-md"></span>
  }

  if (!user) {
    return <div className="py-20 text-center">Not authenticated</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Account Settings</h1>
        <p className="text-base-content/60 mt-1">
          Manage your profile and security settings.
        </p>
      </div>

      <div className="card bg-base-200/70 backdrop-blur-xl border border-base-300/60 shadow-xl">
        <div className="card-body space-y-10">

          {/* PROFILE FORM */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <h2 className="text-xl font-medium">Profile</h2>

            <AvatarSection />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              {/* Email Field - Standardized to match above */}
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
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500
                           text-white shadow-md hover:scale-[1.02] transition"
              >
                {savingProfile ? (
                  <span className="loading loading-bars loading-md"></span>
                ) : (
                  "Save Profile"
                )}
              </button>
            </div>
          </form>

          <div className="divider" />

          {/* PASSWORD FORM */}
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h2 className="text-xl font-medium text-error">Security</h2>
            <p className="text-sm text-base-content/60">
              Updating your password will log you out from all devices.
            </p>

            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-base-content/70 font-medium ml-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg px-4 py-3 bg-base-300/60 border border-rose-500/30
                             focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-base-content/60 hover:text-base-content
                             transition"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-base-content/70 font-medium ml-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg px-4 py-3 bg-base-300/60 border border-rose-500/30
                             focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-base-content/60 hover:text-base-content
                             transition"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-base-content/70 font-medium ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg px-4 py-3 bg-base-300/60 border border-rose-500/30
                             focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-base-content/60 hover:text-base-content
                             transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={savingPassword}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600
                           text-white shadow-md hover:scale-[1.02] transition"
              >
                {savingPassword ? (
                  <span className="loading loading-bars loading-md"></span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
