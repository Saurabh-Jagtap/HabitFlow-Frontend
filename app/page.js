"use client"
import Link from "next/link";

export default function Home() {

  return (
     <div className="min-h-[90vh] bg-base-200 flex items-center justify-center px-4">
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-xl space-y-6">

            <h1 className="text-5xl font-bold tracking-tight">
              HabitFlow
            </h1>

            <p className="text-xl text-base-content/80">
              Build habits. Track consistency. Stay accountable.
            </p>

            <p className="text-base-content/60">
              Turn daily actions into long-term discipline with streaks and
              simple insights.
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Link href="/register">
                <button className="btn btn-primary btn-lg">
                  Get Started
                </button>
              </Link>

              <Link href="/login">
                <button className="btn btn-outline btn-lg">
                  Login
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
