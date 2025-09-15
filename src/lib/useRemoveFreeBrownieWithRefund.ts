import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";

export function useRemoveFreeBrownieWithRefund(user: any, setPoints?: (fn: (prev: number|null) => number|null) => void) {
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
