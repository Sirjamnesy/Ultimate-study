/**
 * The site's public base URL, for absolute links in metadata (share cards).
 * Comes from NEXT_PUBLIC_APP_URL; on Vercel without it, falls back to the
 * deployment's own host. Returns undefined when neither is set, so metadata
 * simply omits metadataBase instead of pointing at a made-up domain.
 */
export function siteUrl(): URL | undefined {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  ];
  for (const c of candidates) {
    if (!c) continue;
    try {
      return new URL(c);
    } catch {
      // ignore a malformed value and try the next one
    }
  }
  return undefined;
}

/** The share image every public page uses unless it sets its own. */
export const ogImage = {
  url: "/hub/og.png",
  width: 1200,
  height: 630,
  alt: "Wekaro: learn AI, week by week. Free to start.",
};
