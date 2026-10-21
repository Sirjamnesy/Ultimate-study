"use client";

import Link from "next/link";
import { useState } from "react";
import {
  type Course,
  courseButtonClass,
  courseHref,
  courseLinkLabel,
  getCourse,
} from "@/lib/data/courses";

type Answers = { level?: string; goal?: string; time?: string };

const questions: { key: keyof Answers; legend: string; options: [string, string][] }[] = [
  {
    key: "level",
    legend: "How much do you know now?",
    options: [
      ["new", "I’m new to AI"],
      ["uses", "I use AI tools"],
      ["builds", "I build with code"],
    ],
  },
  {
    key: "goal",
    legend: "What do you want?",
    options: [
      ["understand", "Understand AI better"],
      ["app", "Build my own app"],
      ["exam", "Pass the Architect exam"],
      ["agents", "Run agents at work"],
    ],
  },
  {
    key: "time",
    legend: "How much time a week?",
    options: [
      ["2", "About 2 hours"],
      ["5", "About 5 hours"],
      ["10", "10 hours or more"],
    ],
  },
];

/** One course to begin with, why, and how to pace it. */
function advise(p: Required<Answers>): { slug: string; why: string; then: string } {
  let slug: string;
  let why: string;
  if (p.goal === "exam") {
    slug = "architect";
    why =
      p.level === "new"
        ? "It starts from the basics in phase one, so you won’t be lost."
        : p.level === "builds"
          ? "You’ll move quickly through phase one and spend your time on the exam domains."
          : "Phase one fills the gaps before the exam work starts.";
  } else if (p.goal === "app") {
    slug = "first-app";
    why =
      p.level === "builds"
        ? "You’ll go fast, and end with something online to show."
        : "It takes you from no code to an app your friends can try.";
  } else if (p.goal === "agents") {
    if (p.level === "builds") {
      slug = "agents";
      why = "You can already build an agent; this is about keeping it working with real users.";
    } else {
      slug = "first-app";
      why = "Build one working app first. Agents in production is the next step.";
    }
  } else if (p.level === "builds") {
    slug = "architect";
    why = "It gives you a full map of how AI systems are built, in order.";
  } else {
    slug = "prompting";
    why = "It’s the quickest way to get better answers from AI, and pairs well with the weekly news.";
  }
  const then =
    p.time === "2"
      ? "At about 2 hours a week, give each week of a course two weeks. Your progress saves."
      : p.time === "5"
        ? "About 5 hours a week fits our courses as written: one week at a time."
        : "With 10 hours or more, you can take two weeks of a course at a time.";
  return { slug, why, then };
}

/** "Where do I start?": three questions, one recommendation from the course list. */
export function Picker() {
  const [answers, setAnswers] = useState<Answers>({});
  const complete = answers.level && answers.goal && answers.time;
  const rec = complete ? advise(answers as Required<Answers>) : null;
  const course: Course | undefined = rec ? getCourse(rec.slug) : undefined;

  return (
    <>
      <div className="pick__qs">
        {questions.map((q, i) => (
          <fieldset key={q.key} data-reveal style={i ? ({ "--d": i } as React.CSSProperties) : undefined}>
            <legend>{q.legend}</legend>
            <div className="opts">
              {q.options.map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={answers[q.key] === v}
                  onClick={() => setAnswers((a) => ({ ...a, [q.key]: v }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="pick__out" aria-live="polite" data-reveal style={{ "--d": 3 } as React.CSSProperties}>
        {rec && course ? (
          <div className={`rec ${course.colour}`} key={`${course.slug}-${rec.why}-${rec.then}`}>
            <p>Start with</p>
            <h3>{course.title}</h3>
            <p>{rec.why}</p>
            <p className="then">{rec.then}</p>
            <Link className={`btn ${courseButtonClass(course)}`} href={courseHref(course)}>
              {courseLinkLabel(course)}
            </Link>
          </div>
        ) : (
          <div className="pick__wait">
            <p>Your starting point shows up here once you’ve answered all three.</p>
          </div>
        )}
      </div>
    </>
  );
}
