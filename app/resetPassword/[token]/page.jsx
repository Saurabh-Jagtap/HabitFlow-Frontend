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
              Your password has been successfully reset. <br/>
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
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-base-content/50 ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/30 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-base-100/50 border border-base-content/10 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50
                               placeholder:text-base-content/30 text-sm transition-all duration-200"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-0 top-0 h-full px-4 text-base-content/40 hover:text-base-content/80 transition-colors"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-base-content/50 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/30 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-base-100/50 border border-base-content/10 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50
                               placeholder:text-base-content/30 text-sm transition-all duration-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-0 top-0 h-full px-4 text-base-content/40 hover:text-base-content/80 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
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