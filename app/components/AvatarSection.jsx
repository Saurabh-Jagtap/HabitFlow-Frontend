"use client"
import { useState } from "react"
import api from "../utils/axios.utils.js";
import { useAuth } from "./AuthProvider"
import toast from "react-hot-toast";

export default function AvatarSection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { user, setUser } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const toastId = toast.loading("Updating avatar...")

    try {
      setUploading(true);
      const res = await api.patch(
        "/api/v1/user/avatar",
        formData
      );
      toast.success("Avatar updated", { id: toastId })
      setUser(res.data.data);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      toast.error("Avatar update failed", { id: toastId })
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    toast.loading("Removing avatar...");
    try {
      setUploading(true);
      const res = await api.delete(
        "/api/v1/user/avatar"
      );
      setUser(res.data.data);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Avatar remove failed", err);
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = previewUrl || user?.avatar || "/Profile_avatar_placeholder.png";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="avatar">
        <div className="w-24 rounded-full ring ring-indigo-400 ring-offset-2 ring-offset-base-100 
  transition-transform duration-300 hover:scale-105">
          <img src={avatarSrc} alt="User avatar" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="btn btn-outline btn-sm">
          Change avatar
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>

        {selectedFile && (
          <button
            className="btn btn-outline btn-sm"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? <span className="loading loading-spinner loading-sm"></span> : "Save avatar"}
          </button>
        )}

        {user?.avatar && !selectedFile && (
          <button
            className="btn btn-ghost btn-sm text-error"
            onClick={handleRemove}
            disabled={uploading}
          >
            Remove avatar
          </button>
        )}
      </div>
    </div>
  );
}