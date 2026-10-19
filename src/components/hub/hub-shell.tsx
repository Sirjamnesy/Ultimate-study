"use client";

import { useEffect, useRef } from "react";
import { HubSprite } from "./icons";
import "./hub.css";

/**
 * Root of the public site (homepage and course pages): the scoped .hub
 * stylesheet, the icon sprite, reveal-on-scroll, and scrolling to #hash
 * targets that only exist once the page has rendered on the client.
 */
export function HubShell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Reveal each block once as it scrolls into view.
    const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
      items.forEach((i) => io!.observe(i));
    } else {
      items.forEach((i) => i.classList.add("is-in"));
    }

    // The homepage renders after the session check, so the browser could not
    // jump to a #section on load. Do it now.
    if (window.location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }

    return () => io?.disconnect();
  }, []);

  return (
    <div className="hub" ref={root}>
      <HubSprite />
      {children}
    </div>
  );
}
