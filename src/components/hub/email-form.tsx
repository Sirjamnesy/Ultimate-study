"use client";

import { useId, useState } from "react";

/**
 * Email sign-up box (newsletter, free chapter, "tell me when it opens").
 *
 * TODO: front-end only for now. On submit it shows a thank-you and stores
 * nothing; a later step wires `list` to the database.
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
  /** Which list this signs up to, for when it is wired to the database. */
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
  const [sent, setSent] = useState(false);

  const fields = (
    <>
      <label className="sr" htmlFor={id}>
        Email address
      </label>
      <input id={id} name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      <button className={buttonClassName} type="submit">
        {sent ? done : button}
      </button>
    </>
  );

  return (
    <form
      className={className}
      data-list={list}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {intro}
      {rowClassName ? <div className={rowClassName}>{fields}</div> : fields}
      <span className="sr" role="status">
        {sent ? done : ""}
      </span>
    </form>
  );
}
