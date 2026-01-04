"use client"
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import axios from "axios";

export default function Settings() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { user, loading, setUser } = useAuth()
    const hasInitialized = useRef(false);

    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
    });

    useEffect(() => {
        if (user && !hasInitialized.current) {
            setFormData({
                fullname: user.fullname || "",
                username: user.username || "",
                email: user.email || "",
            });
            hasInitialized.current = true;
        }
    }, [user]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await axios.patch(`${apiUrl}/api/v1/user/settings`,
                {
                    fullname: formData.fullname,
                    username: formData.username
                },
                { withCredentials: true }
            )
            setUser(response.data.data)
            console.log("API response:", response.data.data);
            alert("Profile updated Successfully!")

        } catch (error) {
            console.error("Profile updation failed", error)
        }

    }

    if (loading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    if (!user) {
        return <div className="py-20 text-center">Not authenticated</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold">Account Settings</h1>
                <p className="text-base-content/60 mt-1">
                    Manage your profile information and security.
                </p>
            </div>

            {/* Card */}
            <div className="card bg-base-200/60 backdrop-blur border border-base-300 shadow-lg">
                <div className="card-body space-y-8">

                    {/* Profile Section */}
                    <form onSubmit={handleSubmit}>
                        <section className="space-y-6">
                            <h2 className="text-xl font-medium">Profile</h2>

                            {/* Avatar */}
                            <div className="flex items-center gap-6">
                                <div className="avatar">
                                    <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                        <img
                                            src={user?.avatar || "/Profile_avatar_placeholder.png"}
                                            alt="User avatar"
                                        />
                                    </div>
                                </div>

                                <button className="btn btn-outline btn-sm">
                                    Change avatar
                                </button>
                            </div>

                            {/* Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    disabled
                                    className="input input-bordered w-full opacity-70"
                                />
                            </div>
                        </section>

                        <div className="divider" />

                        {/* Security Section */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-medium">Security</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="password"
                                    placeholder="Current password"
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="password"
                                    placeholder="New password"
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </section>

                        <div className="divider" />

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button className="btn btn-ghost">
                                Cancel
                            </button>
                            <button className="btn btn-primary" type="submit">
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
