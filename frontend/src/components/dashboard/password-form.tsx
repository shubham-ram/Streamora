"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import { API_URL } from "@/lib/utils";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setIsSaving(true);

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
        setMessage({ type: "success", text: "Password changed!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setMessage({
          type: "error",
          text: data.message || "Failed to change password",
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
          <KeyRound className="w-5 h-5 text-brand-primary-light" />
          Change Password
        </h2>
        <p className="text-sm text-fg-muted mt-0.5">
          Update your account password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-secondary hover:bg-surface-tertiary text-fg-primary text-sm font-medium rounded-lg transition-colors border border-border-subtle disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <KeyRound className="w-4 h-4" />
          )}
          Change Password
        </button>
      </form>
    </section>
  );
}
