"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Phones only (see hub.css): a start bar once the hero has gone, stepping aside for the start band. */
export function StickBar({ heroId, endId }: { heroId: string; endId: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const end = document.getElementById(endId);
    if (!hero || !end) return;
    function place() {
      setOn(window.scrollY > hero!.offsetHeight - 120 && end!.getBoundingClientRect().top > window.innerHeight);
    }
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [heroId, endId]);

  return (
    <div className={`stick${on ? " on" : ""}`} inert={!on}>
      <p>
        Free to start.
        <br />
        No card needed.
      </p>
      <Link className="btn" href="/signup">
        Start free
      </Link>
    </div>
  );
}
