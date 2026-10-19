"use client";

import { useState } from "react";
import { tryQuestions } from "@/lib/data/hub-content";

const letters = ["A", "B", "C", "D"];

/** "Answer one now": pick a topic, answer, see the explanation. */
export function TryQuestion() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);
  const q = tryQuestions[index];
  const answered = picked !== null;

  function show(i: number) {
    setIndex(i);
    setPicked(null);
    setMoved(true);
  }

  return (
    <>
      <div className="topics" role="group" aria-label="Choose a topic">
        {tryQuestions.map((t, i) => (
          <button key={t.topic} type="button" aria-pressed={i === index} onClick={() => show(i)}>
            {t.topic}
          </button>
        ))}
      </div>
      <div className="qs">
        <div className={`q on${moved ? " fade" : ""}${answered ? " answered" : ""}`} data-ui="" key={index}>
          <p className="qtext">{q.question}</p>
          <p className="qfrom small">{q.from}</p>
          <ol>
            {q.options.map((o, i) => {
              let state = "";
              if (answered && i === q.correct) state = " right";
              else if (answered && i === picked) state = " wrong";
              return (
                <li key={o}>
                  <button
                    className={`opt${state}`}
                    type="button"
                    aria-disabled={answered || undefined}
                    onClick={() => {
                      if (!answered) setPicked(i);
                    }}
                  >
                    <span className="k">{letters[i]}</span>
                    <span>{o}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="verdict" aria-live="polite">
            {answered && (
              <>
                <b>{picked === q.correct ? "Right." : `Not quite. The answer is ${letters[q.correct]}.`}</b>{" "}
                {q.why} <br />
                <button type="button" className="again" onClick={() => show((index + 1) % tryQuestions.length)}>
                  Try another
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
