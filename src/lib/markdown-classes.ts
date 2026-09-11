/**
 * Minimal manual markdown styling (no @tailwindcss/typography plugin
 * installed) — shared across product descriptions, course lesson bodies,
 * and the updates feed so rendered markdown reads consistently everywhere.
 */
export const MARKDOWN_CLASSES =
  "text-sm leading-relaxed text-foreground/90 " +
  "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:font-sketch [&_h1]:mt-5 [&_h1]:mb-2 " +
  "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 " +
  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 " +
  "[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 " +
  "[&_li]:mb-1 [&_a]:text-violet-400 [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_strong]:font-semibold [&_code]:font-mono [&_code]:text-xs [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground";
