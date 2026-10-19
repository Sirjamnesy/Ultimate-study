// SVG sprite for the public site: the R1 mark and the social icons.
// Rendered once by HubShell; everything else points at it with <use>.

export function HubSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="r1" viewBox="0 0 100 100">
        <path d="M4.5 54.6L21.5 45.4L38.5 90L21.5 90ZM39.5 35.7L56.5 26.5L38.5 90L21.5 90ZM39.5 35.7L56.5 26.5L74.5 90L57.5 90ZM78.5 14.6L95.5 5.4L74.5 90L57.5 90Z" />
      </symbol>
      <symbol id="i-ig" viewBox="0 0 24 24">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2zm5 3.3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2.2a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6zM17.3 5.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
      </symbol>
      <symbol id="i-tt" viewBox="0 0 24 24">
        <path d="M14 2h3.1a5 5 0 0 0 4.4 4.4v3.1A8 8 0 0 1 17 8v7.5A6.5 6.5 0 1 1 10.5 9v3.2a3.3 3.3 0 1 0 3.5 3.3z" />
      </symbol>
      <symbol id="i-x" viewBox="0 0 24 24">
        <path d="M3 3h5.5l4.2 5.9L17.8 3H21l-6.8 7.9L21.5 21H16l-4.6-6.4L5.8 21H2.6l7.3-8.4z" />
      </symbol>
      <symbol id="i-yt" viewBox="0 0 24 24">
        <path d="M5 5h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zm5 4v6l5.5-3z" />
      </symbol>
      <symbol id="i-in" viewBox="0 0 24 24">
        <path d="M3 9h4v12H3zM5 2.5a2.3 2.3 0 1 1 0 4.6 2.3 2.3 0 0 1 0-4.6zM9.5 9h3.8v1.7c.6-1 1.9-2 3.9-2 4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21h-4z" />
      </symbol>
    </svg>
  );
}

export function Use({ id }: { id: string }) {
  return (
    <svg aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

// TODO: point these at the real Wekaro accounts once they exist.
export const socials = [
  { id: "i-ig", name: "Instagram", href: "#instagram" },
  { id: "i-tt", name: "TikTok", href: "#tiktok" },
  { id: "i-x", name: "X", href: "#x" },
  { id: "i-yt", name: "YouTube", href: "#youtube" },
  { id: "i-in", name: "LinkedIn", href: "#linkedin" },
];
