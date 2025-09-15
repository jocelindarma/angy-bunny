"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Cart from "@/components/Cart";
import { useCart } from "@/context/CartContext";
import { awardLoyaltyPoints } from "@/lib/loyalty";
import { supabase } from "@/lib/supabaseClient";
import angelBunny from "@/../public/assets/angel-bunny.png";
import Image from "next/image";
import { useRemoveFreeBrownieWithRefund } from "@/lib/useRemoveFreeBrownieWithRefund";

export default function CartPage() {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const handleRemoveFreeBrownie = useRemoveFreeBrownieWithRefund(user);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  async function handlePay() {
    setPaying(true);
    setTimeout(async () => {
      setPaying(false);
      setPaid(true);
      const points = await awardLoyaltyPoints(cart);
      setPointsAwarded(points);
      clearCart();
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-rose-700 mb-6">
        Cart Details & Payment
      </h1>
      <div className="w-full max-w-lg">
        {!paid ? (
          <>
            <Cart
              cart={cart}
              updateQty={updateQty}
              removeFromCart={(id, free) => {
                if (free) {
                  handleRemoveFreeBrownie(id);
                } else {
                  removeFromCart(id, false);
                }
              }}
            />
            {!user && (
              <div className="mb-4 text-center text-rose-500 text-sm bg-rose-50 border border-pink-100 rounded-lg py-3 px-2">
                Are you part of the Rewards Program?{" "}
                <button
                  className="text-rose-600 underline hover:text-rose-800 font-semibold"
                  onClick={() => router.push("/auth")}
                >
                  Sign In to earn BrowniePoints
                </button>
              </div>
            )}
            <button
              className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-60"
              onClick={handlePay}
              disabled={cart.length === 0 || paying}
            >
              {paying ? "Processing..." : "Pay Now"}
            </button>
            <button
              className="w-full mt-4 text-rose-400 underline hover:text-rose-600"
              onClick={() => router.push("/")}
            >
              Back to Shop
            </button>
          </>
        ) : (
          <>
            <div className="mt-6 text-center text-green-600 font-bold text-xl">
              Payment Successful! Thank you 💖
              {pointsAwarded !== null && pointsAwarded > 0 && (
                <div className="text-rose-700 text-lg mt-2">
                  You earned {pointsAwarded} BrowniePoint
                  {pointsAwarded > 1 ? "s" : ""}!
                </div>
              )}
            </div>
            <Image
              src={angelBunny}
              alt="Angel Bunny"
              width={80}
              height={80}
              className="mx-auto my-4"
              priority
            />
            <button
              className="w-full mt-4 text-rose-400 underline hover:text-rose-600"
              onClick={() => router.push("/")}
            >
              Back to Shop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
