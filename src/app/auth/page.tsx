"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(180deg,#FFF7F9_0%,#FFFDF7_100%)] px-4">
      <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-rose-700 mb-2 text-center">
          Welcome to Angy Bunny Loyalty Program
        </h1>
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
        />
      </div>
    </div>
  );
}
