"use client";

import { useState } from "react";
import {
  User,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/utils";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
}

interface ProfileFormProps {
  profile: ProfileData;
  onProfileUpdate: (updated: Partial<ProfileData>) => void;
}

export function ProfileForm({ profile, onProfileUpdate }: ProfileFormProps) {
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const body: Record<string, string> = {};
      if (bio !== (profile.bio || "")) body.bio = bio;
      if (avatarUrl !== (profile.avatarUrl || "")) body.avatarUrl = avatarUrl;

      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updated = await res.json();
        onProfileUpdate(updated);
        setMessage({ type: "success", text: "Profile updated!" });
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-surface-primary border border-border-main rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border-main">
        <h2 className="text-lg font-semibold text-fg-primary flex items-center gap-2">
          <User className="w-5 h-5 text-brand-primary-light" />
          Profile
        </h2>
        <p className="text-sm text-fg-muted mt-0.5">
          Update your public profile information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Avatar Preview */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center overflow-hidden relative flex-shrink-0 border-2 border-border-subtle">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-fg-primary" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-fg-primary">
              {profile.username}
            </p>
            <p className="text-xs text-fg-muted">{profile.email}</p>
          </div>
        </div>

        {/* Avatar URL */}
        <div className="space-y-2">
          <label
            htmlFor="avatarUrl"
            className="block text-sm font-medium text-fg-secondary"
          >
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Avatar URL
            </span>
          </label>
          <input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/your-avatar.jpg"
            className="w-full bg-surface-secondary/50 border border-border-subtle rounded-lg py-2.5 px-4 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-fg-secondary"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell viewers about yourself..."
            maxLength={500}
            rows={4}
            className="w-full bg-surface-secondary/50 border border-border-subtle rounded-lg py-2.5 px-4 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none"
          />
          <p className="text-xs text-fg-muted text-right">{bio.length}/500</p>
        </div>

        {/* Feedback + Save */}
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-status-success/10 text-status-success border border-status-success/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary-dark to-brand-secondary hover:from-brand-primary hover:to-brand-secondary-light text-fg-primary text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </form>
    </section>
  );
}
