"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, CheckCircle2, KeyRound } from "lucide-react";
import api from "@/app/utils/axios.utils.js";

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

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/api/v1/user/reset-password/${token}`, {
        newPassword,
      });

      setSuccess(true);
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">

      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-base-200/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

        {/* Top Decoration Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        {success ? (
          // Success State UI
          <div className="text-center flex flex-col items-center animate-in fade-in zoom-in duration-300 py-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="text-2xl font-bold mb-2">All Set!</h2>

            <p className="text-base-content/60 mb-8">
              Your password has been successfully reset. <br />
              You can now log in with your new credentials.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="w-full py-3.5 rounded-xl font-medium text-white
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                         hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Continue to Login
            </button>
          </div>
        ) : (
          // Form State UI
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center sm:text-left">
              <div className="w-12 h-12 bg-base-300/50 rounded-xl flex items-center justify-center mb-4 mx-auto sm:mx-0 border border-white/5">
                <KeyRound className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
              <p className="text-base-content/60 text-sm">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password Input */}
              <div className="space-y-2 group">
                <label className="text-xs font-medium uppercase tracking-wide text-base-content/50 ml-1">
                  New Password
                </label>

                <label className={`
    flex items-center gap-3 w-full rounded-xl px-4 py-3.5 bg-base-100/50 border border-base-content/10 transition-all duration-200
    
    /* Focus State */
    focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500
    
    /* Valid State (Green) */
    has-[:valid]:border-success has-[:valid]:text-success has-[:valid]:focus-within:ring-success/40
    
    /* Invalid State (Red) */
    has-[:invalid:not(:placeholder-shown)]:border-error 
    has-[:invalid:not(:placeholder-shown)]:text-error
    has-[:invalid:not(:placeholder-shown)]:focus-within:ring-error/40
  `}>
                  <div className="text-base-content/30 group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>

                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="grow bg-transparent border-none focus:outline-none placeholder:text-base-content/30 text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="opacity-60 hover:opacity-100 transition cursor-pointer p-1"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                {/* Helper Text with Dynamic Colors */}
                <p className={`
      text-xs ml-1 transition-colors
      text-base-content/50
      group-has-[:invalid:not(:placeholder-shown)]:text-error
      group-has-[:valid]:text-success
  `}>
                  Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-base-content/50 ml-1">
                  Confirm Password
                </label>

                <label className={`
    flex items-center gap-3 w-full rounded-xl px-4 py-3.5 bg-base-100/50 border transition-all duration-200
    
    /* Logic: If passwords match & not empty -> Green. Else -> Default Indigo Focus */
    ${confirmPassword && confirmPassword === newPassword
                    ? "border-success text-success ring-2 ring-success/40"
                    : "border-base-content/10 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
                  }
  `}>
                  <div className={`transition-colors ${confirmPassword && confirmPassword === newPassword ? "text-success" : "text-base-content/30"}`}>
                    <Lock className="h-5 w-5" />
                  </div>

                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="grow bg-transparent border-none focus:outline-none placeholder:text-base-content/30 text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="opacity-60 hover:opacity-100 transition cursor-pointer p-1"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                {/* Match Confirmation Text */}
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-error ml-1">Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-xs text-success ml-1">Passwords match!</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !newPassword || newPassword !== confirmPassword} // Extra safety check
                className="w-full mt-2 relative overflow-hidden rounded-xl py-3 font-medium text-white
             bg-gradient-to-r from-indigo-600 to-purple-600
             shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
             hover:scale-[1.01] active:scale-[0.98]
             disabled:opacity-70 disabled:cursor-not-allowed
             transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;