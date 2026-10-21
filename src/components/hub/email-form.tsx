"use client";

import { useId, useState } from "react";

/**
 * Email sign-up box (newsletter, free chapter, "tell me when it opens").
 *
 * Posts to /api/subscribe, which stores the address against `list`
 * in the email_signups table.
 */
export function EmailForm({
  list,
  className,
  rowClassName,
  intro,
  button,
  done,
  buttonClassName = "btn btn--ink",
}: {
  /** Which list this signs up to: newsletter, free-chapter or notify:<course slug>. */
  list: string;
  className: string;
  /** When set, the field and button sit in their own row element. */
  rowClassName?: string;
  intro?: React.ReactNode;
  button: string;
  done: string;
  buttonClassName?: string;
}) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const sent = state === "sent";
  const status = sent ? done : state === "error" ? "That didn't go through. Please try again." : "";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending" || sent) return;
    const email = new FormData(e.currentTarget).get("email");
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, list }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  const fields = (
    <>
      <label className="sr" htmlFor={id}>
        Email address
      </label>
      <input id={id} name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      <button className={buttonClassName} type="submit" disabled={state === "sending"}>
        {sent ? done : state === "error" ? "Try again" : button}
      </button>
    </>
  );

  return (
    <form
      className={className}
      data-list={list}
      onSubmit={submit}
    >
      {intro}
      {rowClassName ? <div className={rowClassName}>{fields}</div> : fields}
      <span className="sr" role="status">
        {status}
      </span>
    </form>
  );
}
