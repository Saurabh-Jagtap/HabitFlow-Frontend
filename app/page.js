"use client";
import Link from "next/link";
import { CheckCircle2, Flame, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex-1 flex flex-col items-center justify-center bg-base-200 overflow-hidden px-4 sm:px-6 py-10 sm:py-12">
      
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-indigo-500/10 blur-[80px] sm:blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-purple-500/10 blur-[80px] sm:blur-[120px]"></div>
      </div>

      <div className="max-w-5xl w-full text-center space-y-12 animate-fade-in-up">
        
        <div className="rounded-2xl p-2 sm:p-0">
          {/* Brand + Headline */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-6xl font-bold tracking-tight leading-[1.1] sm:leading-tight">
              Build habits.
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Stay consistent.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto px-2">
              HabitFlow helps you turn daily actions into long-term discipline
              using streaks, progress tracking, and simple insights.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:px-10 py-4 rounded-xl font-bold text-white
                               bg-gradient-to-r from-indigo-600 to-purple-600
                               shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
                               hover:scale-[1.02] active:scale-[0.98]
                               transition-all duration-300">
                Get Started Free
              </button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:px-10 py-4 rounded-xl font-bold border border-base-300 
                               text-base-content/80 hover:bg-base-300/50 
                               active:scale-[0.98] transition-all duration-300">
                Log In
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-6">
          
          <div className="group rounded-2xl bg-base-100/50 backdrop-blur-sm p-6 border border-base-300 hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 mx-auto sm:mx-0">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center sm:text-left">Track Habits</h3>
            <p className="text-sm text-base-content/60 text-center sm:text-left">
              Create habits and track your daily progress without friction.
            </p>
          </div>

          <div className="group rounded-2xl bg-base-100/50 backdrop-blur-sm p-6 border border-base-300 hover:border-purple-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 mx-auto sm:mx-0">
              <Flame size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center sm:text-left">Build Streaks</h3>
            <p className="text-sm text-base-content/60 text-center sm:text-left">
              Stay motivated with current and longest streak tracking.
            </p>
          </div>

          <div className="group rounded-2xl bg-base-100/50 backdrop-blur-sm p-6 border border-base-300 hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 mx-auto sm:mx-0">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center sm:text-left">Visual Insights</h3>
            <p className="text-sm text-base-content/60 text-center sm:text-left">
              See completion rates and progress summaries at a glance.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}