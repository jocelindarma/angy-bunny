"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import rewardsBunny from "@/../public/assets/rewards-bunny.jpg";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/";
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push(redirect);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, redirect]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/auth"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(180deg,#FFF7F9_0%,#FFFDF7_100%)] px-4">
      <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-8 w-full max-w-md flex flex-col items-center">
        <button
          className="self-start mb-4 text-rose-400 underline hover:text-rose-600 transition text-sm"
          onClick={() => router.push("/")}
        >
          ← Back to Shop
        </button>
        <Image
          src={rewardsBunny}
          alt="Croissant Bunny"
          width={80}
          height={80}
          className="mb-4"
          priority
        />
        <h1 className="text-2xl font-bold text-rose-700 mb-2 text-center">
          Angy Bunny Rewards Program
        </h1>
        {isRecovery ? (
          success ? (
            <div className="text-green-600 font-semibold text-center">Password updated!</div>
          ) : (
            <form className="w-full" onSubmit={handleReset}>
              <label className="block mb-2 text-rose-700 font-medium">New Password</label>
              <input
                type="password"
                className="w-full mb-4 px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <label className="block mb-2 text-rose-700 font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full mb-4 px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                minLength={6}
                required
              />
              {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )
        ) : (
          <div className="w-full">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#f43f5e",
                      brandAccent: "#be123c",
                      inputBorder: "#fbcfe8",
                      inputLabelText: "#be123c",
                      anchorTextColor: "#f43f5e",
                    },
                    fontSizes: {
                      baseBodySize: "1rem",
                      baseInputSize: "1rem",
                      baseLabelSize: "1rem",
                    },
                    radii: {
                      borderRadiusButton: "0.5rem",
                      inputBorderRadius: "0.5rem",
                    },
                  },
                },
              }}
              providers={[]}
              redirectTo={process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL || "http://localhost:3000/auth"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
