"use client"
import { useState, useEffect } from "react";
import api from "../utils/axios.utils";
import toast from "react-hot-toast";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Lock, RefreshCw } from "lucide-react";
import { useCooldown } from "../utils/useCooldown.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { timeLeft, startCooldown, formatTime } = useCooldown("forgot_pass_cooldown");

  const sendResetLink = async (emailValue) => {
    // Prevent sending if already waiting
    if (timeLeft > 0) return;

    setLoading(true);
    const toastId = toast.loading("Sending link...");

    try {
      await api.post("/api/v1/user/forgot-password", {
        email: emailValue,
      });

      toast.success("Reset link sent!", { id: toastId });
      setSubmitted(true);

      // Trigger standard 60s UI cooldown
      startCooldown(60);

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      // Trigger 1 Hour (3600s) cooldown if Rate Limited
      if (error.response?.status === 429) {
        toast.error("Limit reached. Please wait an hour.", { id: toastId, icon: "🛑" });
        startCooldown(3600);
      } else {
        toast.error(message, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendResetLink(email.trim());
  };

  const handleResend = () => {
    if (timeLeft === 0 && !loading) {
      sendResetLink(email.trim());
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md bg-base-200/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        {submitted ? (
          // SUCCESS STATE WITH RESEND LOGIC
          <div className="text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="text-2xl font-bold mb-2">Check your email</h2>

            <p className="text-base-content/60 mb-8 leading-relaxed">
              We've sent a password reset link to <br />
              <span className="font-medium text-base-content">{email}</span>
            </p>

            {/* NEW RESEND SECTION START */}
            <div className="mb-8 p-4 bg-base-100/50 rounded-xl border border-white/5 w-full">
              <p className="text-sm text-base-content/60 mb-3">
                Didn't receive the email?
              </p>

              <button
                onClick={handleResend}
                disabled={timeLeft > 0 || loading}
                className="flex items-center justify-center gap-2 w-full text-sm font-medium text-indigo-400 hover:text-indigo-300 disabled:text-base-content/30 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : timeLeft > 0 ? ( // FIX 2: Change 'timer' to 'timeLeft'
                  <>
                    <RefreshCw size={14} className="animate-spin-slow" />
                    {/* FIX 3: Change 'timer' to 'timeLeft' */}
                    Resend available in {timeLeft}s
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Resend Link
                  </>
                )}
              </button>
            </div>
            {/* NEW RESEND SECTION END */}

            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to log in
            </Link>
          </div>
        ) : (
          // FORM STATE 
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center sm:text-left">
              <div className="w-12 h-12 bg-base-300/50 rounded-xl flex items-center justify-center mb-4 mx-auto sm:mx-0 border border-white/5">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Forgot password?</h1>
              <p className="text-base-content/60 text-sm">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-base-content/50 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/30 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3.5 bg-base-100/50 border border-base-content/10 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50
                               placeholder:text-base-content/30 text-sm transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden rounded-xl py-3 font-medium text-white
                           bg-gradient-to-r from-indigo-600 to-purple-600
                           shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                           hover:scale-[1.01] active:scale-[0.98]
                           disabled:opacity-70 disabled:cursor-not-allowed
                           transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-base-content/50 hover:text-base-content transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;