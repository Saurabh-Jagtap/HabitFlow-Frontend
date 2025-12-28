"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { LayoutDashboard, LogOut } from "lucide-react"

const Navbar = ({ user }) => {
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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent hover:opacity-90 transition"
          >
            HabitFlow
          </Link>

          {/* Avatar dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="cursor-pointer transition transform hover:scale-105"
            >
              <div className="relative h-10 w-10 rounded-full ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900">
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content mt-3 w-52 rounded-xl bg-slate-900 shadow-xl border border-slate-700 p-2 text-slate-200"
            >
              {/* User Info */}
              <li className="px-3 py-2">
                <p className="font-semibold text-sm">{user?.username}</p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </li>

              <div className="my-2 h-px bg-slate-700" />

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

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut size={16}/>
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
