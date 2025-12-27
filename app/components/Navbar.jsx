"use client";

import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const Navbar = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const avatarUrl =
    user?.avatar || "/Profile_avatar_placeholder.png";

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
        
      <div className="flex-1">
        <Link href="/dashboard" className="btn btn-ghost text-xl font-bold">
          HabitFlow
        </Link>
      </div>


      <div className="flex gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img src={avatarUrl} alt="User avatar" />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-44 p-2 shadow"
          >
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
