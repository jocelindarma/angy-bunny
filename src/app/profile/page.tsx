"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { MENU } from "@/lib/menu";
import userBunny from "@/../public/assets/user-bunny.png";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const router = useRouter();
  const { cart, updateQty, removeFromCart, clearCart, addToCart } = useCart();

  useEffect(() => {
    const getUserAndPoints = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data, error } = await supabase
          .from("loyalty_points")
          .select("change")
          .eq("user_id", user.id);
        if (!error) {
          const total = data?.reduce((sum, row) => sum + row.change, 0) ?? 0;
          setPoints(total);
        }
      }
    };
    getUserAndPoints();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleRedeem = async () => {
    if (!user || points === null || points < 100) return;
    const hasFreeBrownie = cart.some(
      (item) => item.name === "Brownie Cup" && item.free
    );
    if (hasFreeBrownie) {
      setRedeemError("Patience, bunny!\nOnly one free brownie cup per hop");
      setTimeout(() => setRedeemError(""), 2500);
      return;
    }
    setRedeeming(true);
    await supabase.from("loyalty_points").insert([
      {
        user_id: user.id,
        change: -100,
        reason: "Redeemed for free brownie",
      },
    ]);
    setPoints(points - 100);
    setRedeeming(false);
    setRedeemSuccess(true);
    // Add Fudge Brownie to cart
    const brownie = MENU.find((item) => item.name === "Brownie Cup");
    if (brownie) addToCart({ ...brownie, free: true });
    setTimeout(() => {
      setRedeemSuccess(false);
      router.push("/");
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(180deg,#FFF7F9_0%,#FFFDF7_100%)] px-4">
        <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-rose-700 mb-2">
            Not signed in
          </h2>
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold text-lg transition mt-4"
            onClick={() => router.push("/auth")}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

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
          src={userBunny}
          alt="User Bunny"
          width={64}
          height={64}
          className="mb-2"
          priority
        />
        <h2 className="text-2xl font-bold text-rose-700 mb-1">
          {user.email ? user.email.split("@")[0] : "-"}
        </h2>
        <div className="text-rose-500 mb-6 text-sm">
          Member since{" "}
          {user.created_at
            ? new Date(user.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </div>
        <div className="bg-rose-50 border border-pink-100 rounded-xl px-6 py-4 text-center mb-6">
          <div className="text-lg text-rose-700 font-semibold">
            BrowniePoints
          </div>
          <div className="text-3xl font-extrabold text-rose-600 mt-1">
            {points !== null ? points : "..."}
          </div>
          {points !== null && points >= 100 && (
            <button
              className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-60 whitespace-normal break-words text-center max-w-xs mx-auto"
              onClick={handleRedeem}
              disabled={redeeming}
            >
              {redeeming ? (
                "Processing..."
              ) : (
                <>
                  Redeem 100 Points
                  <br />
                  for a Free Brownie Cup
                </>
              )}
            </button>
          )}
          {redeemSuccess && (
            <div className="mt-2 text-green-600 font-semibold">
              Sweet! Your free brownie cup is hopping into your cart 🎉
            </div>
          )}
          {redeemError && (
            <div className="mt-2 text-red-500 font-semibold whitespace-pre-line">
              {redeemError}
            </div>
          )}
        </div>
        <button
          className="flex items-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 rounded-lg font-semibold transition mb-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>
    </div>
  );
}
