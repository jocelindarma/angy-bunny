import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import type { User } from "@supabase/supabase-js";

export function useRemoveFreeBrownieWithRefund(
  user: User | null,
  setPoints?: (fn: (prev: number | null) => number | null) => void
) {
  const { cart, removeFromCart } = useCart();

  return async function handleRemoveFreeBrownie(id: number) {
    const item = cart.find((i) => i.id === id && i.free);
    if (item && user) {
      await supabase.from("loyalty_points").insert([
        {
          user_id: user.id,
          change: 100,
          reason: "Refund for removing free brownie",
        },
      ]);
      if (setPoints) setPoints((prev) => (prev !== null ? prev + 100 : null));
    }
    removeFromCart(id, true);
  };
}
