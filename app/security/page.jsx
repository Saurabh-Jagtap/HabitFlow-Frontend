"use client"
import { useState } from "react";
import api from "@/app/utils/axios.utils";
import toast from "react-hot-toast";
import { Eye, EyeOff, AlertTriangle, ArrowLeft, Lock, Trash2, KeyRound, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Security() {
    const { setUser, loading } = useAuth();
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [confirmText, setConfirmText] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [updatingPass, setUpdatingPass] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error("Please fill in both fields");
            return;
        }

        setUpdatingPass(true);
        const toastId = toast.loading("Updating password...");

        try {
            await api.patch("/api/v1/user/password", {
                currentPassword,
                newPassword,
            });

            toast.success("Password updated! Please login again.", { id: toastId });
            router.push("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password", { id: toastId });
        } finally {
            setUpdatingPass(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmText !== "DELETE") return;

        const toastId = toast.loading("Deleting account...");
        setDeleting(true);

        try {
            await api.delete("/api/v1/user");
            setUser(null);
            toast.success("Account deleted successfully", { id: toastId });
            router.push("/register");
        } catch {
            toast.error("Failed to delete account", { id: toastId });
            setDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen={true} />;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-base-200 relative overflow-hidden">

                {/* Background Ambience */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Navigation */}
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 text-sm font-medium text-base-content/50 hover:text-indigo-500 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Settings
                    </Link>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                            <ShieldAlert className="text-indigo-500" size={32} />
                            Security & Access
                        </h1>
                        <p className="text-base-content/60 text-lg">
                            Manage your password or request account deletion.
                        </p>
                    </div>

                    <div className="space-y-8">

                        {/* CARD 1: CHANGE PASSWORD */}
                        <section className="card bg-base-100/50 backdrop-blur-xl border border-base-300 shadow-xl overflow-hidden">
                            {/* Decorative Top Line */}
                            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />

                            <div className="card-body p-6 sm:p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                                        <KeyRound size={20} />
                                    </div>
                                    <h2 className="text-xl font-semibold">Change Password</h2>
                                </div>

                                <form onSubmit={handlePasswordUpdate} className="space-y-6">

                                    {/* Current Password */}
                                    <div className="form-control gap-2">
                                        <label className="text-sm font-medium text-base-content/70 ml-1">Current Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-indigo-500 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showCurrent ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-base-200/50 border border-base-300 
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                                           transition-all placeholder:text-base-content/30"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-indigo-500 transition cursor-pointer"
                                            >
                                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="form-control gap-2">
                                        <label className="text-sm font-medium text-base-content/70 ml-1">New Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-indigo-500 transition-colors">
                                                <KeyRound size={18} />
                                            </div>
                                            <input
                                                type={showNew ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-base-200/50 border border-base-300 
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                                           transition-all placeholder:text-base-content/30"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew(!showNew)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-indigo-500 transition cursor-pointer"
                                            >
                                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-base-content/50 ml-1 mt-1">Must be at least 6 characters long.</p>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={updatingPass}
                                            className="btn btn-primary px-6 rounded-xl shadow-lg shadow-indigo-500/20 w-full sm:w-auto"
                                        >
                                            {updatingPass ? <span className="loading loading-spinner loading-sm"></span> : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>

                        {/* CARD 2: DANGER ZONE */}
                        <section className="card border border-rose-500/20 shadow-xl overflow-hidden bg-rose-500/5">
                            <div className="card-body p-6 sm:p-10">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">

                                    {/* Icon */}
                                    <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 shrink-0">
                                        <AlertTriangle size={24} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-rose-500">Delete Account</h3>
                                            <p className="text-base-content/70 text-sm mt-1 leading-relaxed">
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </p>
                                        </div>

                                        {/* Confirmation Input */}
                                        <div className="pt-2">
                                            <label className="text-xs font-semibold uppercase text-rose-400/80 tracking-wider mb-2 block">
                                                Type <span className="text-rose-500 font-bold">DELETE</span> to confirm
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <input
                                                    type="text"
                                                    value={confirmText}
                                                    onChange={(e) => setConfirmText(e.target.value)}
                                                    className="input input-bordered input-error w-full sm:max-w-xs bg-base-100/50"
                                                    placeholder="DELETE"
                                                />
                                                <button
                                                    onClick={handleDeleteAccount}
                                                    disabled={confirmText !== "DELETE" || deleting}
                                                    className="btn btn-error text-white shadow-lg shadow-rose-500/20"
                                                >
                                                    {deleting ? (
                                                        <span className="loading loading-spinner loading-sm"></span>
                                                    ) : (
                                                        <>
                                                            <Trash2 size={18} />
                                                            Delete Account
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}