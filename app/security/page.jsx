"use client"
import { useState } from "react";
import api from "@/app/utils/axios.utils";
import toast from "react-hot-toast";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function Security() {

  const {setUser} = useAuth()
  const router = useRouter();

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Eye toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Delete confirmation
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* Password Update */

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Updating password...");

    try {
      await api.patch("/api/v1/user/password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated. Please login again.", {
        id: toastId,
      });

      router.push("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update password",
        { id: toastId }
      );
    }
  };

  /* Delete Account */

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;

    const toastId = toast.loading("Deleting account...");
    setDeleting(true);

    try {
      await api.delete("/api/v1/user");
      setUser(null)
      toast.success("Account deleted successfully", { id: toastId });
      router.push("/register");
    } catch {
      toast.error("Failed to delete account", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-10">

        {/* Change Password */}
        <section className="bg-base-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-sm text-base-content/60">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 bg-base-300/60 border border-base-300 focus:outline-none
                               focus:ring-2 focus:ring-indigo-500/40
                               focus:border-indigo-500/60
                               transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content
                             transition"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-sm text-base-content/60">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg px-4 py-2 bg-base-300/60 border border-base-300 focus:outline-none
                               focus:ring-2 focus:ring-indigo-500/40
                               focus:border-indigo-500/60
                               transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content
                             transition"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-2 rounded-lg font-medium text-white
                bg-gradient-to-r from-indigo-500 to-purple-500
                hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Update Password
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl p-6 border border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <AlertTriangle size={18} />
            <h2 className="font-semibold">Danger Zone</h2>
          </div>

          <p className="text-sm text-base-content/60 mb-4">
            Deleting your account is permanent. All habits and progress will be
            removed.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder='Type "DELETE" to confirm'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg px-4 py-2 bg-base-300/60 border border-rose-500/30 focus:ring-2 focus:ring-rose-500/40 transition"
            />

            <button
              disabled={confirmText !== "DELETE" || deleting}
              onClick={handleDeleteAccount}
              className="px-6 py-2 rounded-lg font-medium text-white
                bg-gradient-to-r from-rose-500 to-red-600
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
