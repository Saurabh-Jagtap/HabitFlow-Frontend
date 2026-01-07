"use client"
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import api from "../utils/axios.utils";
import AvatarSection from "../components/AvatarSection";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const res = await api.patch("/api/v1/user/settings", {
        fullname: profileData.fullname,
        username: profileData.username,
      });

      setUser(res.data.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
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

    try {
      await api.patch("/api/v1/user/password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated. Please log in again.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      router.push('/login')
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["fullname", "username"].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-sm text-base-content/60 capitalize">
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
                    className="w-full rounded-lg px-4 py-2 bg-base-300/60 border border-base-300
                               focus:ring-2 focus:ring-indigo-500/40 transition"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-sm text-base-content/60">Email</label>
                <input
                  value={profileData.email}
                  disabled
                  className="w-full rounded-lg px-4 py-2 bg-base-300/40 border border-base-300 opacity-60"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                disabled={savingProfile}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500
                           text-white shadow-md hover:scale-[1.02] transition"
              >
                {savingProfile ? (<span className="loading loading-bars loading-md"></span>) : "Save Profile"}
              </button>
            </div>
          </form>

          <div className="divider" />

          {/* PASSWORD FORM */}
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h2 className="text-xl font-medium text-error">Security</h2>
            <p className="text-sm text-base-content/60">
              Updating password will log you out from all devices.
            </p>

            {["currentPassword", "newPassword", "confirmPassword"].map(
              (field) => (
                <div key={field} className="relative space-y-1">
                  <label className="text-sm text-base-content/60 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData[field]}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        [field]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg px-4 py-2 bg-base-300/60 border border-rose-500/30
                               focus:ring-2 focus:ring-rose-500/40 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-9 text-base-content/60"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )
            )}

            <div className="flex justify-end">
              <button
                disabled={savingPassword}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-600
                           text-white shadow-md hover:scale-[1.02] transition"
              >
                {savingPassword ? (<span className="loading loading-bars loading-md"></span>) : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
