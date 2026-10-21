/* eslint-disable @next/next/no-img-element -- fixed-size design images, sized by the stylesheet */
import Link from "next/link";
import { type Course, courseButtonClass, courseHref, courseLinkLabel } from "@/lib/data/courses";

/** A week card from the app, used as a picture. */
export function WeekCard() {
  return (
    <div className="week">
      <div className="top">
        <span>Week 3 of 26</span>
        <span>AI Foundations</span>
      </div>
      <div className="t">Prompt Engineering Foundations</div>
      <div className="bar2">
        <i />
      </div>
      <div className="prog">
        <span>2 of 4 done</span>
        <span>+75 XP earned</span>
      </div>
      <ul>
        <li className="done">
          <span className="box" />
          <span className="n">Prompt Engineering for ChatGPT</span>
          <span className="xp">+50 XP</span>
        </li>
        <li className="done">
          <span className="box" />
          <span className="n">Anthropic prompt engineering guide</span>
          <span className="xp">+25 XP</span>
        </li>
        <li>
          <span className="box" />
          <span className="n">Cookbook: prompt tutorials</span>
          <span className="xp">+40 XP</span>
        </li>
      </ul>
    </div>
  );
}

function CardMedia({ c }: { c: Course }) {
  const href = courseHref(c);
  if (c.media === "week") {
    return (
      <Link className="card__media" href={href} data-ui="" tabIndex={-1} aria-hidden="true">
        <WeekCard />
      </Link>
    );
  }
  if (c.media === "playbook") {
    return (
      <Link className="card__media" href={href} tabIndex={-1} aria-hidden="true">
        <img className="full" src="/hub/pb-cover.jpg" width={1600} height={893} loading="lazy" alt="" />
        <img className="page" src="/hub/pb-files.jpg" width={500} height={600} loading="lazy" alt="" />
      </Link>
    );
  }
  return (
    <ol className="card__media c-outline" aria-label="What it covers">
      {(c.outline ?? []).map(([h]) => (
        <li key={h}>{h}</li>
      ))}
    </ol>
  );
}

/** One course or read on the shelf. */
export function CourseCard({ c, hidden }: { c: Course; hidden?: boolean }) {
  const href = courseHref(c);
  return (
    <article className={`card ${c.colour}`} data-kind={c.kind} data-soon={c.soon ? "" : undefined} hidden={hidden}>
      <p className="card__tab">{c.tab}</p>
      <div className="card__in">
        <CardMedia c={c} />
        <div className="card__body">
          <h3>
            <Link href={href}>{c.title}</Link>
          </h3>
          <p className="desc">{c.short}</p>
          <div className="card__foot">
            <p className="price">{c.price}</p>
            <Link className={`btn ${courseButtonClass(c)}`} href={href}>
              {courseLinkLabel(c)}
            </Link>
            <p className="note">{c.note}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
