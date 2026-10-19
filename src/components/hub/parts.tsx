// Small shared pieces of the public site's markup.

/** Stagger step for a [data-reveal] block, as the --d custom property. */
export function d(n: number): React.CSSProperties {
  return { "--d": n } as React.CSSProperties;
}

/** Section intro: heading on the left, one sentence on the right. */
export function Intro({
  id,
  title,
  children,
  aside,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="grid intro">
      <h2 id={id} data-reveal>
        {title}
      </h2>
      <p data-reveal style={d(1)}>
        {children}
        {aside && <span className="aside">{aside}</span>}
      </p>
    </div>
  );
}

/** One row of an accordion list (news, questions, course phases). */
export function Fold({
  group,
  open,
  date,
  title,
  children,
}: {
  group: string;
  open?: boolean;
  date?: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <details name={group} open={open}>
      <summary>
        {date !== undefined && <span className="d">{date}</span>}
        <span>{title}</span>
        <span className="plus" aria-hidden="true" />
      </summary>
      <div className="a">
        <div>{children}</div>
      </div>
    </details>
  );
}
