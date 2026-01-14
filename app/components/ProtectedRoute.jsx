"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is done loading AND no user exists, kick them out
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // While checking, show a loading spinner (or nothing)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // If user is not logged in (and redirecting), show nothing to prevent flashing content
  if (!user) return null;

  // If logged in, render the actual page content
  return <>{children}</>;
};

export default ProtectedRoute;