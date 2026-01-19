"use client";
import { useState } from "react";
import api from "../utils/axios.utils.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider.jsx";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useCooldown } from "../utils/useCooldown.js";

export default function Login() {
  const { fetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { timeLeft, startCooldown, formatTime } = useCooldown("login_cooldown");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft > 0) return;

    setError("");
    setLoading(true);

    try {
      await api.post(`/api/v1/user/login`, { email, password });
      await fetchUser();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      // Check if the error comes from the server response
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data.message;

        // Handle Rate Limit specifically (Status 429)
        if (status === 429) {
          startCooldown(15 * 60);
          toast.error("Security Alert: " + message);

        } else {
          toast.error(message || "Login failed");
        }
      } else {
        // Network errors 
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

    <main className="relative flex-1 flex justify-center items-center bg-base-200 overflow-hidden px-4 py-18 sm:px-6">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-10 sm:left-1/4 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-indigo-500/20 blur-3xl opacity-50 sm:opacity-100"></div>
        <div className="absolute top-1/3 -right-10 sm:right-1/4 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-purple-500/20 blur-3xl opacity-50 sm:opacity-100"></div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-base-100 border border-base-300 shadow-xl p-6 sm:p-8 space-y-6 animate-fade-in-up">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm sm:text-base text-base-content/60">
            Log in to continue building habits
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-2 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Section */}
          <div className="form-control mb-4 group">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>

            <label className={`
    flex items-center gap-3 w-full rounded-lg px-4 bg-base-300/60 border border-base-300 transition
    
    /* 1. BRAND FOCUS (Default Focus State) */
    focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500

    /* 2. SUCCESS STATE (Green when valid) */
    has-[:valid]:border-success has-[:valid]:text-success has-[:valid]:focus-within:ring-success/40

    /* 3. ERROR STATE (Red only if invalid AND user has typed something) */
    has-[:invalid:not(:placeholder-shown)]:border-error 
    has-[:invalid:not(:placeholder-shown)]:text-error
    has-[:invalid:not(:placeholder-shown)]:focus-within:ring-error/40
  `}>

              {/* Icon */}
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>

              {/* Input */}
              <input
                type="email"
                placeholder="mail@site.com"
                className="grow bg-transparent border-none focus:outline-none placeholder:opacity-60 py-2.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

           {/* Error Text - Only shows when invalid AND not placeholder shown */}
            <div className="text-xs text-error mt-1 hidden group-has-[:invalid:not(:placeholder-shown)]:block">
              Enter a valid email address
            </div>
          </div>


          {/* Password Section */}
          <div className="form-control group">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>

            <label className={`
    flex items-center gap-3 w-full rounded-lg px-4 bg-base-300/60 border border-base-300 transition
    
    /* FOCUS - Indigo */
    focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500

    /* VALID - Green */
    has-[:valid]:border-success has-[:valid]:text-success has-[:valid]:focus-within:ring-success/40

    /* INVALID (Typed) - Red */
    has-[:invalid:not(:placeholder-shown)]:border-error 
    has-[:invalid:not(:placeholder-shown)]:text-error
    has-[:invalid:not(:placeholder-shown)]:focus-within:ring-error/40
  `}>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="grow bg-transparent border-none focus:outline-none placeholder:opacity-60 py-2.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="opacity-60 hover:opacity-100 transition cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            {/* Helper Text */}
            <div className="text-xs text-error mt-1 hidden group-has-[:invalid:not(:placeholder-shown)]:block">
              Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number
            </div>

            <div className="flex justify-end mt-2">
              <Link
                href="/forgotPassword"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || timeLeft > 0}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-300
            ${timeLeft > 0
                ? "bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600"
                : "w-full rounded-xl py-3 font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : timeLeft > 0 ? (
              <span className="flex items-center justify-center gap-2">
                Try again in {formatTime(timeLeft)}
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-base-content/70">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}