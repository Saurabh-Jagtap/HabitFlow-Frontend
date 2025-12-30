"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      await axios.post(
        `${apiUrl}/api/v1/user/register`,
        formData,
        {
          withCredentials: true,
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
    <main className="relative min-h-[90vh] bg-base-200 overflow-hidden flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl bg-base-100 border border-base-300 shadow-xl p-8 space-y-6 animate-fade-in-up">

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

          <input
            type="text"
            placeholder="Full name"
            className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-indigo-500"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Avatar Upload */}
          <div className="space-y-1">
            <label className="text-sm text-base-content/60">
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
                       bg-linear-to-r from-indigo-500 to-purple-600
                       shadow-md hover:shadow-lg
                       hover:from-indigo-600 hover:to-purple-700
                       transition-all duration-300
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
