"use client"
import React, { useState } from "react";
import api from "../utils/axios.utils.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { isValidEmail } from "../utils/emailValidation.js";

const Register = () => {

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }
  
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      await api.post(
        `/api/v1/user/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Account created successfully!")
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex-1 bg-base-200 flex justify-center items-center px-4 sm:px-6 py-2 sm:py-4 overflow-y-auto">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-base-100 border border-base-300 shadow-xl p-6 sm:p-8 space-y-6 animate-fade-in-up">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm sm:text-base text-base-content/60">
            Start building better habits today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-2 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">

          <div className="grid grid-cols-1 gap-3">
            {/* Fullname */}
            <div>
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full py-2.5 bg-base-300/40 border-base-300 focus:outline-none
                        focus:ring-2 focus:ring-indigo-500/40
                        focus:border-indigo-500/60
                        transition"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full py-2.5 bg-base-300/40 border-base-300 focus:outline-none
                        focus:ring-2 focus:ring-indigo-500/40
                        focus:border-indigo-500/60
                        transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@gmail.com"
              className="input input-bordered w-full py-2.5 bg-base-300/40 border-base-300 focus:outline-none
                        focus:ring-2 focus:ring-indigo-500/40
                        focus:border-indigo-500/60
                        transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full py-2.5 pr-12 bg-base-300/40 border-base-300 focus:outline-none
                        focus:ring-2 focus:ring-indigo-500/40
                        focus:border-indigo-500/60
                        transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-base-content/60 hover:text-base-content"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="pt-1">
            <label className="label py-1">
              <span className="label-text text-xs font-medium text-base-content/60">Profile avatar (optional)</span>
            </label>
            <div className="flex items-center justify-center w-full">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered file-input-sm w-full bg-base-300/20"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-bold text-white
                         bg-gradient-to-r from-indigo-600 to-purple-600
                               shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                               hover:scale-[1.02] active:scale-[0.98]
                               transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 font-medium hover:text-indigo-300 transition"
          >
            Log in
          </Link>
        </p>

      </div>
    </main>
  );
};

export default Register;
