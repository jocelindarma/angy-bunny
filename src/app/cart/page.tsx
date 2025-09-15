"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Cart from "@/components/Cart";
import { useCart } from "@/context/CartContext";
import { awardLoyaltyPoints } from "@/lib/loyalty";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useRemoveFreeBrownieWithRefund } from "@/lib/useRemoveFreeBrownieWithRefund";
import { NominatimAutocomplete } from "@/components/NominatimAutocomplete";

export default function CartPage() {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showDelivery, setShowDelivery] = useState(false);
  const [delivery, setDelivery] = useState({
    name: "",
    contact: "+62",
    address: "",
    notes: "",
  });
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const router = useRouter();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const handleRemoveFreeBrownie = useRemoveFreeBrownieWithRefund(user);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  function handleShowDelivery() {
    setShowDelivery(true);
  }

  function handleDeliveryChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "contact") {
      let sanitized = value;
      if (!sanitized.startsWith("+62")) {
        sanitized = "+62" + sanitized.replace(/[^0-9]/g, "");
      } else {
        sanitized = "+62" + sanitized.slice(3).replace(/[^0-9]/g, "");
      }
      setDelivery({ ...delivery, contact: sanitized });
    } else {
      setDelivery({ ...delivery, [name]: value });
    }
  }

  function validateDelivery() {
    if (
      !delivery.name.trim() ||
      !delivery.address.trim() ||
      !delivery.contact.trim()
    ) {
      setDeliveryError("Name, address, and contact number are required.");
      return false;
    }
    if (!delivery.contact.startsWith("+62")) {
      setDeliveryError("Contact number must start with +62.");
      return false;
    }
    const digits = delivery.contact.slice(3);
    if (digits.length !== 10 || !/^[0-9]{10}$/.test(digits)) {
      setDeliveryError("Invalid contact number");
      return false;
    }
    setDeliveryError(null);
    return true;
  }

  async function handlePay() {
    if (!showDelivery) {
      setShowDelivery(true);
      return;
    }
    if (!validateDelivery()) return;
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
        Review Your Order
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
            {showDelivery && !paid && (
              <div className="bg-white border border-pink-100 rounded-xl p-4 mt-6 mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-rose-700 mb-4">
                  Delivery Details
                </h2>
                <label
                  className="block text-rose-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="w-full mb-4 px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  value={delivery.name}
                  onChange={handleDeliveryChange}
                  required
                />
                <label
                  className="block text-rose-700 font-medium mb-2"
                  htmlFor="contact"
                >
                  Phone Number
                </label>
                <input
                  id="contact"
                  name="contact"
                  className="w-full mb-4 px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  value={delivery.contact}
                  onChange={handleDeliveryChange}
                  required
                />
                <label
                  className="block text-rose-700 font-medium mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <NominatimAutocomplete
                  value={delivery.address}
                  onChange={(val) => setDelivery({ ...delivery, address: val })}
                  onSelect={(val) => setDelivery({ ...delivery, address: val })}
                  className="w-full mb-4 px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <label
                  className="block text-rose-700 font-medium mb-2 mt-4"
                  htmlFor="notes"
                >
                  Delivery Instructions (optional)
                </label>
                <input
                  id="notes"
                  name="notes"
                  className="w-full mb-4 px-3 py-2 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
                  value={delivery.notes || ""}
                  onChange={(e) =>
                    setDelivery({ ...delivery, notes: e.target.value })
                  }
                  placeholder="Example: Leave at front desk, call on arrival”"
                />
                {deliveryError && (
                  <div className="text-red-500 mb-4 text-center">
                    {deliveryError}
                  </div>
                )}
              </div>
            )}
            {!user && (
              <div className="text-center text-rose-500 text-sm bg-rose-50 border border-pink-100 rounded-lg py-3 px-2 mb-6">
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
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-60"
              onClick={showDelivery ? handlePay : handleShowDelivery}
              disabled={cart.length === 0 || paying}
            >
              {paying ? "Processing..." : "Pay Now"}
            </button>
            <button
              className="w-full mt-6 text-rose-400 underline hover:text-rose-600"
              onClick={() => router.push("/")}
            >
              Back to Shop
            </button>
          </>
        ) : (
          <>
            <div className="mt-8 text-center text-green-600 font-bold text-xl">
              Payment Successful! Thank you 💖
              {pointsAwarded !== null && pointsAwarded > 0 && (
                <div className="text-rose-700 text-lg mt-4">
                  You earned {pointsAwarded} BrowniePoint
                  {pointsAwarded > 1 ? "s" : ""}!
                </div>
              )}
            </div>
            <Image
              src="/assets/angel-bunny.png"
              alt="Angel Bunny"
              width={80}
              height={80}
              className="mx-auto my-6"
              priority
            />
            <button
              className="w-full mt-6 text-rose-400 underline hover:text-rose-600"
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
