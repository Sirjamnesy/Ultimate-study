"use client";

import { supabase } from "@/lib/supabase/client";
import type { ProgressData } from "./progress";

/**
 * Fetches progress data for the currently authenticated user from Supabase.
 * Returns null if no row exists yet (new user) or if unauthenticated.
 */
export async function fetchProgressFromSupabase(): Promise<ProgressData | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_progress")
    .select("data")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;
  return data.data as ProgressData;
}

/**
 * Upserts the current progress for the authenticated user to Supabase.
 * Fire-and-forget safe — errors are logged silently.
 * localStorage remains the source of truth for instant reads.
 */
export async function syncProgressToSupabase(progress: ProgressData): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      data: progress as unknown as import("@/lib/supabase/database.types").Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[supabase-sync] upsert failed:", error.message);
  }
}
