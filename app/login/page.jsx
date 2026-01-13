"use client";
import { useState } from "react";
import api from "../utils/axios.utils.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider.jsx";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { fetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post(`/api/v1/user/login`, { email, password });
      await fetchUser();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing slightly */}

          {/* Email Input */}
          <div>
            <label className="label">
              <span className="label-text mb-1 font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full py-3 rounded-lg px-4
                 bg-base-300/60
                 border border-base-300
                 focus:outline-none
                 focus:ring-2 focus:ring-indigo-500/40
                 focus:border-indigo-500/60
                 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input Group */}
          <div className="form-control">
            <label className="label">
              <span className="label-text mb-1 font-medium">Password</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input input-bordered w-full py-3 pr-12
                   rounded-lg px-4
                   bg-base-300/60
                   border border-base-300
                   focus:outline-none
                   focus:ring-2 focus:ring-indigo-500/40
                   focus:border-indigo-500/60
                   transition"
                required
              />

              {/* Eye Icon Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center
                   text-base-content/60 hover:text-base-content
                   transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
            disabled={loading}
            className="w-full rounded-xl py-3 font-medium text-white
               bg-gradient-to-r from-indigo-600 to-purple-600
               shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
               hover:scale-[1.02] active:scale-[0.98]
               transition-all duration-200"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Log In"
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