"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PointsDisplay() {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
      setLoading(false);
    };
    fetchPoints();
  }, []);

  if (loading) return <div>Loading points...</div>;
  if (points === null) return <div>Sign in to see your points.</div>;
  return <div>Your points: {points}</div>;
}
