"use client"
import React, { useState } from "react";
import api from "../utils/axios.utils.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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
      <div className="w-full md:max-w-4xl max-w-md rounded-2xl bg-base-100 border border-base-300 shadow-xl p-6 sm:p-8 space-y-6 animate-fade-in-up">

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

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Row 1: Full Name & Username (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Full Name */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Full Name</span>
              </label>
              <label className="flex items-center gap-3 w-full rounded-lg px-4 py-2.5 bg-base-300/40 border border-base-300 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/60 transition">
                <div className="opacity-50">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="grow bg-transparent border-none min-w-0 focus:outline-none placeholder:opacity-60 text-sm"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Username</span>
              </label>
              <label className="flex items-center gap-3 w-full rounded-lg px-4 py-2.5 bg-base-300/40 border border-base-300 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/60 transition">
                <div className="opacity-50">
                  <AtSign size={18} />
                </div>
                <input
                  type="text"
                  placeholder="johndoe123"
                  className="grow bg-transparent border-none min-w-0 focus:outline-none placeholder:opacity-60 text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>

          {/* Row 2: Email */}
          <div className="form-control group">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Email</span>
            </label>

            <label className={`
      flex items-center gap-3 w-full rounded-lg px-4 py-2.5 bg-base-300/40 border border-base-300 transition
      focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/60
      has-[:valid]:border-success has-[:valid]:text-success has-[:valid]:focus-within:ring-success/40
      has-[:invalid:not(:placeholder-shown)]:border-error 
      has-[:invalid:not(:placeholder-shown)]:text-error
      has-[:invalid:not(:placeholder-shown)]:focus-within:ring-error/40
    `}>
              <div className="opacity-50">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="email@gmail.com"
                className="grow bg-transparent border-none min-w-0 focus:outline-none placeholder:opacity-60 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <div className="text-xs text-error mt-1 hidden group-has-[:invalid:not(:placeholder-shown)]:block">
              Please enter a valid email address
            </div>
          </div>

          {/* Row 3: Password */}
          <div className="form-control group">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Password</span>
            </label>

            <label className={`
      flex items-center gap-3 w-full rounded-lg px-4 py-2.5 bg-base-300/40 border border-base-300 transition
      focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/60
      has-[:valid]:border-success has-[:valid]:text-success has-[:valid]:focus-within:ring-success/40
      has-[:invalid:not(:placeholder-shown)]:border-error 
      has-[:invalid:not(:placeholder-shown)]:text-error
      has-[:invalid:not(:placeholder-shown)]:focus-within:ring-error/40
    `}>
              <div className="opacity-50">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="grow bg-transparent border-none min-w-0 focus:outline-none placeholder:opacity-60 text-sm"
                placeholder="Create a strong password"
                required
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="opacity-60 hover:opacity-100 transition cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            <p className={`
        text-xs mt-1 transition-colors text-base-content/50
        group-has-[:invalid:not(:placeholder-shown)]:text-error
        group-has-[:valid]:text-success
    `}>
              Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number
            </p>
          </div>

          {/* Row 4: Avatar Upload */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium text-base-content/60">Profile avatar (optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full rounded-lg bg-base-300/40 border-base-300 text-sm file:bg-base-content/10 file:border-none file:text-base-content/70 hover:file:bg-base-content/20 transition"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-bold text-white
                 bg-gradient-to-r from-indigo-600 to-purple-600
                 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                 hover:scale-[1.02] active:scale-[0.98]
                 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
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
