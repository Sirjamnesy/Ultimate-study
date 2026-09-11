"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

/**
 * Per-product course completion tracking. Kept separate from the free
 * roadmap's progress-provider/user_progress — this is a different
 * gamification domain (purchased course completion, not XP/streaks/badges)
 * and, unlike product_purchases, product_progress allows the owning user
 * to read/write it directly under RLS (low-stakes, doesn't gate access).
 */
export function useProductProgress(productId: string) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoaded(true);
        return;
      }
      const { data } = await supabase
        .from("product_progress")
        .select("completed_resource_ids")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (!cancelled) {
        setCompletedIds((data?.completed_resource_ids as string[] | null) ?? []);
        setLoaded(true);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [productId]);

  const persist = useCallback(async (ids: string[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("product_progress").upsert(
      {
        user_id: user.id,
        product_id: productId,
        completed_resource_ids: ids,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product_id" }
    );
    if (error) console.error("[product-progress] upsert failed:", error.message);
  }, [productId]);

  const toggle = useCallback((resourceId: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId];
      persist(next);
      return next;
    });
  }, [persist]);

  const isCompleted = useCallback(
    (resourceId: string) => completedIds.includes(resourceId),
    [completedIds]
  );

  return { completedIds, isCompleted, toggle, loaded };
}
