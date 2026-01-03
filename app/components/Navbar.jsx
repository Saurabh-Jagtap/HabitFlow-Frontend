"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { House, LayoutDashboard, LogOut, Settings } from "lucide-react"
import { useAuth } from "./AuthProvider.jsx"

const Navbar = () => {
  const { user, loading } = useAuth()
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const avatarUrl = user?.avatar && user.avatar.trim() !== "" ? user.avatar : "/Profile_avatar_placeholder.png";

  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1 sm:gap-2 hover:opacity-90 transition"
          >
            {/* Brand text */}
            <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              HabitFlow
            </span>
          </Link>


          {/* Avatar dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="cursor-pointer transition transform hover:scale-105"
            >
              <div className="relative h-11 w-11 sm:h-10 sm:w-10 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 overflow-hidden">
                {loading ? (
                  <div className="h-full w-full bg-slate-700 animate-pulse" />
                ) : (
                  <Image
                    src={avatarUrl}
                    alt="User avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                )}
              </div>

            </label>

            <ul
              tabIndex={0}
              className="dropdown-content mt-3 w-52 rounded-xl bg-slate-900 shadow-xl border border-slate-700 p-3 sm:p-2 text-slate-200"
            >
              {/* User Info */}
              <li className="px-3 py-2">
                <p className="font-semibold text-sm">{user?.username}</p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </li>

              <div className="my-2 h-px bg-slate-700" />

              {/* Home */}
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                >
                  <House size={16} />
                  Home
                </Link>
              </li>

              {/* Dashboard */}
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </li>

                {/* Settings */}
              <li>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                >
                  <Settings size={16} />
                  Settings
                </Link>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
