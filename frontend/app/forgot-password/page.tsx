/*CloudLedger\frontend\app\forgot-password\page.tsx */

"use client";

import { useState } from "react";
import Link from "next/link";
import { sendResetEmail } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendResetEmail(email);
      setMessage("Password reset email sent. Please check your inbox. If you don’t see it in a few minutes, check your spam or junk folder.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-2 text-2xl font-bold text-black">Forgot password</h1>
        <p className="mb-6 text-sm text-gray-600">
  Enter your email and we’ll send you a password reset link.
  If you usually sign in with Google, go back and use Continue with Google instead.
</p>

        {message && (
          <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-xl text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <p className="mt-4 text-sm text-center text-black">
          Remembered your password?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}