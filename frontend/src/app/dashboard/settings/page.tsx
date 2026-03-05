"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/lib/utils";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PasswordForm } from "@/components/dashboard/password-form";

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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setProfile(await res.json());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {profile && (
        <ProfileForm
          profile={profile}
          onProfileUpdate={(updated) =>
            setProfile((prev) => (prev ? { ...prev, ...updated } : prev))
          }
        />
      )}
      <PasswordForm />
    </div>
  );
}
