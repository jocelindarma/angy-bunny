import { supabase } from "@/lib/supabaseClient";
import { CartItem } from "@/lib/types";

export async function awardLoyaltyPoints(cart: CartItem[]): Promise<number> {
  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  // 1 point per Rp1000
  const points = Math.floor(total / 1000);
  if (points <= 0) return 0;

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return 0;

  // Insert points row
  await supabase.from("loyalty_points").insert([
    {
      user_id: user.id,
      change: points,
      reason: `Purchase of Rp${total}`,
    },
  ]);
  return points;
}
