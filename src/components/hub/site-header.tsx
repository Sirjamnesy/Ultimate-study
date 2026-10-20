"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { socials, Use } from "./icons";

type NavItem = { label: string; href: string };

/** On the homepage the section links are plain #anchors; elsewhere they go back to "/". */
function nav(home: boolean): NavItem[] {
  const at = home ? "" : "/";
  return [
    { label: "News", href: `${at}#news` },
    { label: "Courses", href: `${at}#courses` },
    { label: "The Playbook", href: "/courses/playbook" },
    { label: "Try a question", href: `${at}#try` },
  ];
}

function NavLink({ item, ...rest }: { item: NavItem } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (item.href.startsWith("#")) {
    return (
      <a href={item.href} {...rest}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} {...rest}>
      {item.label}
    </Link>
  );
}

export function SiteHeader({ home = false }: { home?: boolean }) {
  const items = nav(home);
  const [small, setSmall] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [current, setCurrent] = useState(-1);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Tighten after the top of the page, slide away while scrolling down and come back on any scroll up;
  // on the homepage, mark the section in view.
  useEffect(() => {
    const targets = items.map((i) =>
      i.href.startsWith("#") ? document.getElementById(i.href.slice(1)) : null
    );
    let lastY = window.scrollY;
    function onScroll() {
      const sy = window.scrollY;
      setSmall(sy > 80);
      if (sy < 80 || sy < lastY - 4) setHidden(false);
      else if (sy > lastY + 4) setHidden(true);
      if (Math.abs(sy - lastY) > 4) lastY = sy;
      const y = window.innerHeight * 0.35;
      let cur = -1;
      targets.forEach((t, i) => {
        if (!t) return;
        const r = t.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) cur = i;
      });
      setCurrent(cur);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // items only depends on `home`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  // Phone menu: lock the page behind it, close on Escape.
  useEffect(() => {
    document.body.classList.toggle("hub-locked", open);
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("hub-locked");
    };
  }, [open]);

  const close = () => setOpen(false);
  const BrandTag = home ? "a" : Link;

  return (
    <>
      <header className={`hdr${small ? " small" : ""}${hidden && !open ? " hide" : ""}`} id="hdr">
        <div className="hdr__in">
          <BrandTag className="brand" href={home ? "#top" : "/"} aria-label="Wekaro, home">
            <Use id="r1" />
            <span>wekaro</span>
          </BrandTag>
          <nav aria-label="Main">
            {items.map((item, i) => (
              <NavLink key={item.href} item={item} aria-current={i === current ? "true" : undefined} />
            ))}
          </nav>
          <div className="hdr__act">
            <Link className="signin" href="/login">
              Sign in
            </Link>
            <Link className="btn btn--sm" href="/signup">
              Start free
            </Link>
            <button
              ref={menuBtn}
              className="menu-btn"
              type="button"
              aria-expanded={open}
              aria-controls="sheet"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <div className={`sheet${open ? " open" : ""}`} id="sheet" aria-label="Menu" inert={!open}>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <NavLink item={item} onClick={close} />
            </li>
          ))}
          <li>
            <Link href="/login" onClick={close}>
              Sign in
            </Link>
          </li>
        </ul>
        <div className="foot">
          <Link className="btn btn--ink" href="/signup" onClick={close}>
            Start free
          </Link>
          <div className="soc">
            {socials.slice(0, 4).map((s) => (
              <a key={s.id} href={s.href} onClick={close}>
                <Use id={s.id} />
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
