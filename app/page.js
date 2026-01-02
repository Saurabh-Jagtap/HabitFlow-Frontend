"use client"
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-200 flex items-start sm:items-center justify-center px-4 sm:px-6 pt-20 sm:pt-0 relative">
      <div className="max-w-5xl w-full text-center space-y-12 animate-fade-in-up">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
        </div>

        <div className="rounded-2xl bg-base-200/60 
                p-6 sm:p-0 
                sm:bg-transparent">

          {/* Brand + Headline */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-snug sm:leading-tight">
              Build habits.
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Stay consistent.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto mb-10">
              HabitFlow helps you turn daily actions into long-term discipline
              using streaks, progress tracking, and simple insights.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button
                className="w-full sm:w-auto
           rounded-xl px-8 py-4
           font-medium text-white
           bg-gradient-to-r from-indigo-500 to-purple-600
           shadow-lg hover:shadow-xl
           hover:ring-2 hover:ring-indigo-500/40
           transition-all duration-300"
              >
                Get Started Free
              </button>
            </Link>

            <Link href="/login">
              <button
                className="w-full sm:w-auto rounded-xl px-8 py-4 font-medium border border-base-300 text-base-content/80 hover:bg-base-300 transition-all duration-300"
              >
                Log In
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12">

          <div className="rounded-xl bg-base-100 p-6 border border-base-300">
            <h3 className="text-lg font-medium mb-2">
              Track Habits
            </h3>
            <p className="text-sm text-base-content/60">
              Create habits and track your daily progress without friction.
            </p>
          </div>

          <div className="rounded-xl bg-base-100 p-6 border border-base-300">
            <h3 className="text-lg font-medium mb-2">
              Build Streaks
            </h3>
            <p className="text-sm text-base-content/60">
              Stay motivated with current and longest streak tracking.
            </p>
          </div>

          <div className="rounded-xl bg-base-100 p-6 border border-base-300">
            <h3 className="text-lg font-medium mb-2">
              Visual Insights
            </h3>
            <p className="text-sm text-base-content/60">
              See completion rates and progress summaries at a glance.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
