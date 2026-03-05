"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/utils";
import {
  User,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  KeyRound,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Profile form
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setBio(data.bio || "");
          setAvatarUrl(data.avatarUrl || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const token = localStorage.getItem("token");
      const body: Record<string, string> = {};
      if (bio !== (profile?.bio || "")) body.bio = bio;
      if (avatarUrl !== (profile?.avatarUrl || "")) body.avatarUrl = avatarUrl;

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
        setProfile((prev) => (prev ? { ...prev, ...updated } : prev));
        setProfileMessage({ type: "success", text: "Profile updated!" });
      } else {
        const data = await res.json();
        setProfileMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch {
      setProfileMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setIsSavingPassword(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setPasswordMessage({ type: "success", text: "Password changed!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setPasswordMessage({
          type: "error",
          text: data.message || "Failed to change password",
        });
      }
    } catch {
      setPasswordMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
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

        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
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
                {profile?.username}
              </p>
              <p className="text-xs text-fg-muted">{profile?.email}</p>
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
          {profileMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                profileMessage.type === "success"
                  ? "bg-status-success/10 text-status-success border border-status-success/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {profileMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSavingProfile}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary-dark to-brand-secondary hover:from-brand-primary hover:to-brand-secondary-light text-fg-primary text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </form>
      </section>

      {/* Password Section */}
      <section className="bg-surface-primary border border-border-main rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-main">
          <h2 className="text-lg font-semibold text-fg-primary flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-primary-light" />
            Change Password
          </h2>
          <p className="text-sm text-fg-muted mt-0.5">
            Update your account password
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-fg-secondary"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-surface-secondary/50 border border-border-subtle rounded-lg py-2.5 px-4 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-fg-secondary"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full bg-surface-secondary/50 border border-border-subtle rounded-lg py-2.5 px-4 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
              <p className="text-xs text-fg-muted">At least 8 characters</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-fg-secondary"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface-secondary/50 border border-border-subtle rounded-lg py-2.5 px-4 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Feedback */}
          {passwordMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                passwordMessage.type === "success"
                  ? "bg-status-success/10 text-status-success border border-status-success/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {passwordMessage.type === "success" ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {passwordMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSavingPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-secondary hover:bg-surface-tertiary text-fg-primary text-sm font-medium rounded-lg transition-colors border border-border-subtle disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingPassword ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" />
            )}
            Change Password
          </button>
        </form>
      </section>
    </div>
  );
}
