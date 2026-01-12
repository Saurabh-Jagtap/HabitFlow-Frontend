"use client";
import { useState } from "react";
import api from "../utils/axios.utils";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/v1/user/forgot-password", {
        email: email.trim(),
      });
    } catch {
      // intentionally silent
    } finally {
      setSubmitted(true);
      setLoading(false);
      toast.success("If an account exists, you'll receive a reset link");
    }
  };

  if (submitted) {
    return (
      <div className="text-center text-base-content/70 space-y-2">
        <h2 className="text-lg font-semibold">Check your email</h2>
        <p>
          If an account exists, a password reset link has been sent.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text mb-1">Email</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full py-3 rounded-lg px-4
                     bg-base-300/60 border border-base-300
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                     focus:border-indigo-500/60 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3 font-medium text-white
                   bg-gradient-to-r from-indigo-600 to-purple-600
                   shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                   hover:scale-[1.02] active:scale-[0.98]
                   transition-all duration-300"
      >
        {loading ? (
          <span className="loading loading-bars loading-md"></span>
        ) : (
          "Send reset link"
        )}
      </button>
    </form>
  );
};

export default ForgotPassword;
