"use client"
import React, { useState } from "react";
import api from "../utils/axios.utils.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

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
        `${apiUrl}/api/v1/user/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-base-200 flex justify-center items-start sm:items-center px-4 sm:px-6 pt-20 sm:pt-0">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-base-100 border border-base-300 shadow-xl p-6 sm:p-8 space-y-6 animate-fade-in-up
">


        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">
            Create your account
          </h1>
          <p className="text-base-content/60">
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
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Fullname */}
          <div>
            <label className="label">
              <span className="label-text m-2">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Full name"
              className="input input-bordered w-full py-3 bg-base-300/60
    border border-base-300
    focus:outline-none
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
            <label className="label">
              <span className="label-text m-2">Username</span>
            </label>
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full py-3 bg-base-300/60
    border border-base-300
    focus:outline-none
    focus:ring-2 focus:ring-indigo-500/40
    focus:border-indigo-500/60
    transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text m-2">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full py-3 bg-base-300/60
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

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text m-2">Password</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input input-bordered w-full py-3 pr-12
                 bg-base-300/60
    border border-base-300
    focus:outline-none
    focus:ring-2 focus:ring-indigo-500/40
    focus:border-indigo-500/60
    transition"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center
                 text-base-content/60 hover:text-base-content
                 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>


          {/* Avatar Upload */}
          <div className="space-y-1">
            <label className="text-sm text-base-content/60 m-2">
              Profile avatar (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full bg-base-200"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-medium text-white
                       bg-gradient-to-r from-indigo-500 to-purple-500
    text-white
    shadow-md shadow-indigo-500/20
    hover:shadow-lg hover:shadow-indigo-500/30
    hover:scale-[1.02]
    active:scale-[0.98]
    transition-all duration-200
                       disabled:opacity-60"
          >
            {loading ? (
              <span className="loading loading-bars loading-md"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Log in
          </Link>
        </p>

      </div>
    </main>
  );
};

export default Register;
