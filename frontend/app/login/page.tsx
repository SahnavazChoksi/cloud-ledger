/**CloudLedger\frontend\app\login\page.tsx */

"use client";

import { useState } from "react";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  setError("");
  setLoading(true);

  try {
    await signInWithGoogle();
    router.push("/");
  } catch (err: any) {
    setError(err.message || "Google login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-black">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-xl text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-xl text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          
        />
<p className="text-sm mb-4 text-right">
  <a href="/forgot-password" className="text-blue-600 underline">
    Forgot password?
  </a>
</p>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-3 text-xs text-gray-500 text-center">
  Use Forgot password only if you created your account with email and password.
</p>
        <div className="my-4 flex items-center gap-3">
  <div className="h-px flex-1 bg-gray-300" />
  <span className="text-sm text-gray-500">or</span>
  <div className="h-px flex-1 bg-gray-300" />
</div>

<button
  type="button"
  onClick={handleGoogleLogin}
  disabled={loading}
  className="w-full border border-gray-300 bg-white text-black py-2 rounded-xl hover:bg-gray-50"
>
  Continue with Google
</button>
        <p className="text-sm mt-4 text-center text-black">
  Don’t have an account?{" "}
  <a href="/signup" className="text-blue-600 underline">
    Sign up
  </a>
</p>
      </form>
    </div>
  );
}