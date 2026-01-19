"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import api from "../utils/axios.utils.js"
import { House, LayoutDashboard, LogOut, Settings } from "lucide-react"
import { useAuth } from "./AuthProvider.jsx"
import toast from "react-hot-toast"

const Navbar = () => {
  const { user, setUser, loading } = useAuth()
  const router = useRouter();

  const avatarUrl = user?.avatar && user.avatar.trim() !== "" ? user.avatar : "/Profile_avatar_placeholder.png";

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem) {
      elem.blur();
    }
  };

  const handleLogout = async () => {
    closeDropdown()
    const toastId = toast.loading("loading...")
    try {
      await api.post(
        `/api/v1/user/logout`,
        {}
      );
      setUser(null)
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed", { id: toastId })
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Brand Section */}
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
              HabitFlow
            </span>
          </Link>

          {/* Avatar dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="cursor-pointer block p-1 rounded-full transition transform active:scale-95"
            >
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 overflow-hidden">
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

            {/* Dropdown Menu - Optimized for mobile width */}
            <ul
              tabIndex={0}
              className="dropdown-content mt-3 w-56 rounded-xl bg-slate-900 shadow-2xl border border-slate-700 p-2 text-slate-200"
            >
              <li className="px-4 py-3">
                <p className="font-semibold text-sm truncate">{user?.username || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </li>

              <div className="my-1 h-px bg-slate-800" />

              <li>
                <Link 
                href="/" 
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-3 sm:py-2 rounded-lg hover:bg-slate-800 transition">
                  <House size={18} className="text-indigo-400" />
                  <span className="text-sm">Home</span>
                </Link>
              </li>

              <li>
                <Link 
                href="/dashboard" 
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-3 sm:py-2 rounded-lg hover:bg-slate-800 transition">
                  <LayoutDashboard size={18} className="text-indigo-400" />
                  <span className="text-sm">Dashboard</span>
                </Link>
              </li>

              <li>
                <Link 
                href="/settings" 
                onClick={closeDropdown}
                className="flex items-center gap-3 px-4 py-3 sm:py-2 rounded-lg hover:bg-slate-800 transition">
                  <Settings size={18} className="text-indigo-400" />
                  <span className="text-sm">Settings</span>
                </Link>
              </li>

              <div className="my-1 h-px bg-slate-800" />

              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 sm:py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
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
