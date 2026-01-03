"use client"
import React from "react";
import { useState, useEffect } from "react";

export default function settings() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await axios.get(
                `${apiUrl}/api/v1/user/me`,
                { withCredentials: true }
            );
            console.log(res)
            setUser(res.data.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

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
                    <section className="space-y-6">
                        <h2 className="text-xl font-medium">Profile</h2>

                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                            <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                    <img
                                        src="/Profile_avatar_placeholder.png"
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
                                className="input input-bordered w-full"
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                className="input input-bordered w-full"
                            />
                            <input
                                type="email"
                                placeholder="Email"
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
                        <button className="btn btn-primary">
                            Save changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
