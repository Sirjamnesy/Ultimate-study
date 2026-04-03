"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton browser client — one instance per tab.
// The Supabase SDK automatically persists the auth session in localStorage.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
