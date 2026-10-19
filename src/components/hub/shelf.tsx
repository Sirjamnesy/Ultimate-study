"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { courses } from "@/lib/data/courses";
import { CourseCard } from "./course-card";

type Filter = "all" | "course" | "read" | "soon";

const chips: { f: Filter; label: string }[] = [
  { f: "all", label: "All" },
  { f: "course", label: "Courses" },
  { f: "read", label: "Reads" },
  { f: "soon", label: "Coming soon" },
];

function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The homepage course shelf: filter chips, arrows and a sideways rail of cards. */
export function Shelf() {
  const rail = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const edges = useCallback(() => {
    const r = rail.current;
    if (!r) return;
    setAtStart(r.scrollLeft < 8);
    setAtEnd(r.scrollLeft + r.clientWidth >= r.scrollWidth - 8);
  }, []);

  useEffect(() => {
    edges();
    window.addEventListener("resize", edges);
    return () => window.removeEventListener("resize", edges);
  }, [edges]);

  // A new filter starts the rail from the left.
  useEffect(() => {
    if (rail.current) rail.current.scrollLeft = 0;
    edges();
  }, [filter, edges]);

  function step(dir: 1 | -1) {
    const r = rail.current;
    if (!r) return;
    const card = r.querySelector<HTMLElement>(".card:not([hidden])");
    const w = card ? card.getBoundingClientRect().width + 16 : 320;
    r.scrollBy({ left: dir * w, behavior: reduceMotion() ? "auto" : "smooth" });
  }

  const shows = (c: (typeof courses)[number]) =>
    filter === "all" || (filter === "soon" ? !!c.soon : c.kind === filter);

  return (
    <>
      <div className="bar" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
        <div className="chips" role="group" aria-label="Show">
          {chips.map((c) => (
            <button key={c.f} type="button" aria-pressed={filter === c.f} onClick={() => setFilter(c.f)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="arrows">
          <button type="button" className="prev" aria-label="Previous" aria-controls="rail" disabled={atStart} onClick={() => step(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className="next" aria-label="Next" aria-controls="rail" disabled={atEnd} onClick={() => step(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="rail" id="rail" ref={rail} tabIndex={0} aria-label="Courses and reads" onScroll={edges}>
        {courses.map((c) => (
          <CourseCard key={c.slug} c={c} hidden={!shows(c)} />
        ))}
      </div>
      <p className="swipe">Swipe for more courses and reads.</p>
    </>
  );
}
