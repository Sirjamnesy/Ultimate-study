"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { getLastSeenTimestamp, setLastSeenTimestamp } from "@/lib/store/updates-seen";

export function UpdatesBadge({ className }: { className?: string }) {
  const pathname = usePathname();
  const [latest, setLatest] = useState<string | null>(null);
  // Lazy initializer — reads localStorage synchronously during render rather
  // than via a setState-in-effect (getLastSeenTimestamp() is SSR-safe: it
  // catches the ReferenceError from a missing `localStorage` and returns null).
  const [lastSeen, setLastSeen] = useState<string | null>(getLastSeenTimestamp);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("updates")
      .select("published_at")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setLatest(data?.published_at ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (pathname === "/updates" && latest) {
      setLastSeenTimestamp(latest);
      // Marking the feed "seen" on navigating to /updates is the external
      // sync this effect exists for, not incidental derived state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastSeen(latest);
    }
  }, [pathname, latest]);

  const unread = !!latest && (!lastSeen || new Date(latest) > new Date(lastSeen));

  return (
    <Link href="/updates">
      <Button variant="ghost" size="icon" className={`relative h-8 w-8 ${className ?? ""}`}>
        <Megaphone className="h-4 w-4" />
        {unread && (
          <span className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-500" />
        )}
      </Button>
    </Link>
  );
}
