"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import api from "../utils/axios.utils";
import AvatarSection from "../components/AvatarSection";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  ArrowLeft, 
  Shield, 
  User, 
  Mail, 
  AtSign, 
  Save, 
  Lock,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner"; // Assuming you have this from previous steps

export default function Settings() {
  const { user, loading, setUser } = useAuth();
  const hasInitialized = useRef(false);

  // PROFILE STATE
  const [profileData, setProfileData] = useState({
    fullname: "",
    username: "",
    email: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // INIT FORM DATA
  useEffect(() => {
    if (user && !hasInitialized.current) {
      setProfileData({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
      });
      hasInitialized.current = true;
    }
  }, [user]);

  // PROFILE UPDATE
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    
    // Validations could go here
    if(!profileData.fullname && !profileData.username) {
        toast.error("No fields provided for update");
        setSavingProfile(false);
        return;
    }

    try {
      const res = await api.patch("/api/v1/user/settings", {
        fullname: profileData.fullname,
        username: profileData.username,
      });

      toast.success("Profile updated successfully");
      setUser(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen={true} />;
  
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-base-content/60">
        Please log in to view settings.
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-base-content/50 hover:text-indigo-500 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
          <p className="text-base-content/60 text-lg">
            Manage your personal information and security preferences.
          </p>
        </div>

        <div className="grid gap-8">
          
          {/* --- SECTION 1: PUBLIC PROFILE --- */}
          <section className="card bg-base-100/50 backdrop-blur-xl border border-base-300 shadow-xl overflow-hidden">
             {/* Decorative Top Line */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />
            
            <div className="card-body p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <User size={20} />
                    </div>
                    <h2 className="text-xl font-semibold">Public Profile</h2>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-8">
                  
                  {/* Avatar Centerpiece */}
                  <div className="flex flex-col items-center sm:items-start pb-6 border-b border-base-content/5">
                    <span className="text-sm font-medium text-base-content/60 mb-4 uppercase tracking-wider">Profile Photo</span>
                    <AvatarSection />
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="form-control gap-2">
                      <label className="text-sm font-medium text-base-content/70 ml-1">Full Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-indigo-500 transition-colors">
                           <User size={18} />
                        </div>
                        <input
                          type="text"
                          value={profileData.fullname}
                          onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200/50 border border-base-300 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                                     transition-all placeholder:text-base-content/30"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="form-control gap-2">
                      <label className="text-sm font-medium text-base-content/70 ml-1">Username</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-indigo-500 transition-colors">
                           <AtSign size={18} />
                        </div>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-base-200/50 border border-base-300 
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                                     transition-all placeholder:text-base-content/30"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    {/* Email (Full Width & Disabled) */}
                    <div className="form-control gap-2 md:col-span-2">
                      <label className="text-sm font-medium text-base-content/70 ml-1 flex items-center justify-between">
                        <span>Email Address</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/30">
                           <Mail size={18} />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-base-content/30">
                           <Lock size={16} />
                        </div>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full pl-10 pr-10 py-3 rounded-xl bg-base-200/30 border border-base-300 
                                     text-base-content/50 cursor-not-allowed select-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="btn btn-primary px-8 rounded-xl shadow-lg shadow-indigo-500/20"
                    >
                      {savingProfile ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
            </div>
          </section>

          {/* --- SECTION 2: SECURITY CARD --- */}
          <section className="card bg-base-100/50 backdrop-blur-xl border border-base-300 shadow-xl overflow-hidden hover:border-indigo-500/30 transition-colors group">
            <Link href="/security" className="block w-full text-left">
                <div className="card-body p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-base-content group-hover:text-indigo-500 transition-colors">
                                Password & Security
                            </h3>
                            <p className="text-sm text-base-content/60 mt-1 max-w-md">
                                Update your password, manage sessions, or delete your account permanently.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-sm font-medium text-indigo-500 gap-1 bg-indigo-500/5 px-4 py-2 rounded-lg border border-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        Manage Access
                        <ChevronRight size={16} />
                    </div>
                </div>
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}