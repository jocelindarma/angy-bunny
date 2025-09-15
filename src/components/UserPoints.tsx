import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { UserCircle2 } from "lucide-react";

export default function UserPoints() {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserAndPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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

  if (!user) {
    return (
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-pink-100 hover:bg-rose-100 text-rose-700 text-sm font-semibold shadow-sm transition"
        onClick={() => router.push("/auth")}
        title="Sign in to collect points"
      >
        <UserCircle2 className="w-6 h-6" />
        Sign In
      </button>
    );
  }

  return (
    <button
      className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-pink-100 hover:bg-rose-100 text-rose-700 text-sm font-semibold shadow-sm transition"
      onClick={() => router.push("/profile")}
      title="View profile and points"
    >
      <UserCircle2 className="w-6 h-6" />
      {points !== null ? `${points} pts` : "..."}
    </button>
  );
}
