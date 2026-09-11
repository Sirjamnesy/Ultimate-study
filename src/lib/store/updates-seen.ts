"use client";

const KEY = "ultimate-study:updates-last-seen";

/**
 * Unread tracking for the public updates feed via localStorage, not a DB
 * read-receipts table — the feed's audience is public/anonymous-heavy and
 * cross-device sync isn't worth the added schema/RLS surface. Upgradable
 * later (a per-user table) without touching the updates table itself.
 */
export function getLastSeenTimestamp(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setLastSeenTimestamp(iso: string): void {
  try {
    localStorage.setItem(KEY, iso);
  } catch {
    // private window / blocked storage — unread badge just won't persist
  }
}
