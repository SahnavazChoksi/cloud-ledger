/*CloudLedger\frontend\app\profile\page.tsx */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateUserProfile } from "@/lib/auth";

function ProfileContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await updateUserProfile({
        displayName: displayName.trim(),
      });
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
        >
          ← Back
        </button>

        <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold text-black">Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account details.
          </p>

          {message && (
            <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                Name or Company Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name or company name"
                className="w-full rounded-xl border px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full rounded-xl border bg-gray-50 px-4 py-3 text-gray-600 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                This is the email used for login and cannot be changed here.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}