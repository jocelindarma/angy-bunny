import { supabase } from "@/lib/supabaseClient";
import { CartItem } from "@/lib/types";

export async function awardLoyaltyPoints(cart: CartItem[]): Promise<number> {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const points = Math.floor(total / 10000);
  if (points <= 0) return 0;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return 0;

  await supabase.from("loyalty_points").insert([
    {
      user_id: user.id,
      change: points,
      reason: `Purchase of Rp${total}`,
    },
  ]);
  return points;
}
