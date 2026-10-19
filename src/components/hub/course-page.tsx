/* eslint-disable @next/next/no-img-element -- fixed-size design images, sized by the stylesheet */
import Link from "next/link";
import { type Course, courseButtonClass, courses } from "@/lib/data/courses";
import { CourseCard, WeekCard } from "./course-card";
import { EmailForm } from "./email-form";
import { HubShell } from "./hub-shell";
import { d, Fold, Intro } from "./parts";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

function HeroMedia({ c }: { c: Course }) {
  if (c.media === "week") {
    return (
      <div
        className="c-hero__media card__media"
        data-ui=""
        role="img"
        aria-label="A week card from the Wekaro app: week 3, two of four done"
      >
        <WeekCard />
      </div>
    );
  }
  if (c.media === "playbook") {
    return (
      <figure className="c-hero__media card__media">
        <img
          className="full"
          src="/hub/pb-cover.jpg"
          width={1600}
          height={893}
          alt="Cover of The Architect’s Playbook: Enterprise LLM Architecture"
          fetchPriority="high"
        />
      </figure>
    );
  }
  return (
    <ol className="c-hero__media card__media c-outline" aria-label="What it covers">
      {(c.outline ?? []).map(([h]) => (
        <li key={h}>{h}</li>
      ))}
    </ol>
  );
}

function Hero({ c }: { c: Course }) {
  return (
    <section className={`c-hero ${c.colour}`}>
      <div className="grid">
        <div className="c-hero__txt">
          <h1>{c.title}</h1>
          <p className="promise">{c.promise}</p>
          <p className="price">{c.price}</p>
          <div className="act">
            <a className={`btn ${courseButtonClass(c)}`} href={c.soon ? "#notify" : "#plans"}>
              {c.cta}
            </a>
            <a className="link" href="#inside">
              {c.phases ? "See all 26 weeks" : "What’s inside"}
            </a>
          </div>
          <p className="note">{c.note}</p>
        </div>
        <HeroMedia c={c} />
        <dl className="c-facts">
          {c.facts.map(([n, what]) => (
            <div key={what}>
              <dt>{n}</dt>
              <dd>{what}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const examDomains: [string, number][] = [
  ["Agents", 82],
  ["Tools", 74],
  ["Claude Code", 80],
  ["Prompting", 71],
  ["Context", 66],
];

/** Two pieces of the app, drawn as pictures: a practice exam result and a quiz question. */
function AppShots() {
  return (
    <div className="c-shots">
      <div className="shot" data-ui="" role="img" aria-label="A practice exam result in the Wekaro app: 780 out of 1000, a pass">
        <div className="ex">
          <div className="top">
            <span>Practice exam, attempt 2</span>
            <span>45 minutes</span>
          </div>
          <div className="score">
            <b>780</b>
            <span>out of 1000. Pass mark 720.</span>
          </div>
          {examDomains.map(([name, pct]) => (
            <div className="dom" key={name}>
              <span>{name}</span>
              <i>
                <s style={{ width: `${pct}%` }} />
              </i>
              <span>{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="shot" data-ui="" role="img" aria-label="A weekly quiz question in the Wekaro app, answered correctly">
        <div className="ex">
          <div className="top">
            <span>Week 5 quiz</span>
            <span>Question 3 of 15</span>
          </div>
          <p className="qq">What does tool_choice: &apos;auto&apos; let Claude do?</p>
          <div className="op">Use at least one tool, always</div>
          <div className="op ok">Decide whether to use a tool or answer directly</div>
          <div className="op">Pick a tool at random</div>
          <p className="ex-why">Right. With auto, Claude reads the conversation and decides.</p>
        </div>
      </div>
    </div>
  );
}

function Inside({ c }: { c: Course }) {
  // Number the weeks straight through all phases.
  const phases = (c.phases ?? []).map((p, n, all) => {
    const first = all.slice(0, n).reduce((sum, q) => sum + q.weeks.length, 0) + 1;
    return { ...p, first, last: first + p.weeks.length - 1 };
  });
  return (
    <section className="c-inside sec" id="inside" aria-labelledby="in-h">
      <Intro id="in-h" title="What’s inside">
        {c.phases
          ? "Five phases, one week at a time. Week one is free."
          : c.soon
            ? "The plan for now. It may change a little before it opens."
            : "The ideas it covers, each drawn as a diagram."}
      </Intro>
      <div className="grid">
        {c.phases ? (
          <div className="stories phases">
            {phases.map((p, n) => (
              <Fold
                key={p.name}
                group="phase"
                open={n === 0}
                date={`Weeks ${p.first} to ${p.last}`}
                title={`Phase ${n + 1}: ${p.name}`}
              >
                <ol className="weeks">
                  {p.weeks.map((w, k) => (
                    <li key={w}>
                      <span className="w">Week {p.first + k}</span>
                      <span>{w}</span>
                      {p.first + k === 1 && <b className="free">Free</b>}
                    </li>
                  ))}
                </ol>
              </Fold>
            ))}
          </div>
        ) : (
          <ol className="rows">
            {(c.outline ?? []).map(([h, line]) => (
              <li key={h} data-reveal>
                <h3>{h}</h3>
                <p>{line}</p>
              </li>
            ))}
          </ol>
        )}
        {c.media === "week" && <AppShots />}
        {c.pages && (
          <div className="c-pages">
            {c.pages.map(([file, alt]) => (
              <img key={file} src={`/hub/${file}`} loading="lazy" alt={`A Playbook page: ${alt.toLowerCase()}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Plans({ c }: { c: Course }) {
  if (c.soon) {
    return (
      <section className="plans sec" id="notify" aria-labelledby="pl-h">
        <Intro id="pl-h" title="Hear when it opens">
          Leave your email and we’ll send one message, the day it’s ready. {c.price}
        </Intro>
        <div className="grid">
          <EmailForm
            list={`notify:${c.slug}`}
            className="sub"
            rowClassName="sub__row"
            button="Tell me"
            done="We’ll tell you"
            buttonClassName="btn"
            intro={
              <div className="sub__txt">
                <h3>{c.title}</h3>
                <p>{c.note}</p>
              </div>
            }
          />
        </div>
      </section>
    );
  }
  return (
    <section className="plans sec" id="plans" aria-labelledby="pl-h">
      <Intro id="pl-h" title="Free, or the whole thing">
        Start free with no card. Pay once when you want the rest.
      </Intro>
      <div className="grid">
        <div className="plan-grid">
          <div className="plan plan--free" data-reveal>
            <h3>Free</h3>
            <p className="big">₦0</p>
            <ul>
              {(c.freeGets ?? []).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Link className="btn btn--ink" href="/signup">
              Start free
            </Link>
          </div>
          <div className="plan plan--full" data-reveal style={d(1)}>
            <h3>The whole {c.kind}</h3>
            <p className="big">{c.full}</p>
            <ul>
              {(c.fullGets ?? []).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Link className="btn btn--ink" href="/checkout">
              Pay once
            </Link>
            <p className="note">
              Paid in naira or US dollars, by card or bank transfer, through Paystack.{" "}
              {c.slug === "playbook" ? c.note : "No subscription."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One page for every course and read, drawn from the course list. */
export function CoursePage({ course: c }: { course: Course }) {
  const others = courses.filter((x) => x.slug !== c.slug);
  return (
    <HubShell>
      <SiteHeader />
      <main id="course">
        <Hero c={c} />
        <Inside c={c} />
        <Plans c={c} />
        <section className="c-faq sec" id="questions" aria-labelledby="fq-h">
          <Intro id="fq-h" title="Questions">
            Something else? Write to us and a person will answer.
          </Intro>
          <div className="grid">
            <div className="stories">
              {c.faq.map(([q, a], n) => (
                <Fold key={q} group="faq" open={n === 0} title={q}>
                  <p>{a}</p>
                </Fold>
              ))}
            </div>
          </div>
        </section>
        <section className="shelf sec c-more" aria-labelledby="mo-h">
          <Intro id="mo-h" title="More on the shelf">
            Every course and read starts free.
          </Intro>
          <div className="rail" id="rail" tabIndex={0} aria-label="More courses and reads">
            {others.map((x) => (
              <CourseCard key={x.slug} c={x} />
            ))}
          </div>
          <p className="swipe">Swipe for more.</p>
        </section>
      </main>
      <SiteFooter />
    </HubShell>
  );
}
