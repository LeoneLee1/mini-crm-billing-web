"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/auth/authService";

export default function LoginFeatures() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login({ email, password });
      const { access_token, refresh_token, user } = res.data;
      setAuth(access_token, refresh_token, user);
      router.replace("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Login failed. Please check your email and password.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: "#1d3494" }}>
      {/* Decorative blobs */}
      <div className="fixed -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ backgroundColor: "#4a6ee0" }} />
      <div className="fixed -bottom-15 -right-15 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ backgroundColor: "#4a6ee0" }} />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top brand strip */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <Image src="/logo/logo-bg-white.png" width={100} height={100} alt="Logo" />
            </div>
            <div className="text-left leading-tight">
              <p className="font-bold text-gray-800 text-sm">Lee Digital</p>
              <p className="text-xs text-gray-400 tracking-wide">CRM &amp; BILLING</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue to your workspace.</p>
        </div>

        {/* Form */}
        <div className="px-8 py-7">
          {error && <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" className="h-11" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-11 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold mt-1 cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
