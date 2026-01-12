"use client"
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../utils/axios.utils";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/api/v1/user/reset-password/${token}`, {
        newPassword,
      });

      setSuccess(true);
      toast.success("Password updated successfully");
    } catch {
      toast.error("Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Password reset successful</h2>
        <button
          onClick={() => router.push("/login")}
          className="btn btn-primary"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* New Password */}
      <div className="space-y-1">
        <label className="text-sm text-base-content/60">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg px-4 py-2 bg-base-300/60 border border-base-300
                       focus:ring-2 focus:ring-indigo-500/40 transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm text-base-content/60">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg px-4 py-2 bg-base-300/60 border border-base-300
                       focus:ring-2 focus:ring-indigo-500/40 transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg py-2 text-white
                   bg-gradient-to-r from-indigo-600 to-purple-600
                   hover:scale-[1.02] transition"
      >
        {loading ? "Updating..." : "Set new password"}
      </button>
    </form>
  );
};

export default ResetPassword;
