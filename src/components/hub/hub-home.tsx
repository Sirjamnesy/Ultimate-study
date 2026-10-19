/* eslint-disable @next/next/no-img-element -- fixed-size design images, sized by the stylesheet */
import Link from "next/link";
import { Fragment } from "react";
import { homeFaq, marqueeHeadlines, newsStories, newsWeekNote } from "@/lib/data/hub-content";
import { EmailForm } from "./email-form";
import { HubShell } from "./hub-shell";
import { Use } from "./icons";
import { d, Fold, Intro } from "./parts";
import { Picker } from "./picker";
import { Shelf } from "./shelf";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { StickBar } from "./stick-bar";
import { TryQuestion } from "./try-question";

function i(n: number): React.CSSProperties {
  return { "--i": n } as React.CSSProperties;
}

function MarqueeSet() {
  return (
    <div className="marquee__set">
      <span>This week in AI</span>
      <Use id="r1" />
      {marqueeHeadlines.map((h) => (
        <Fragment key={h}>
          <span>{h}</span>
          <Use id="r1" />
        </Fragment>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__top" />
      <div className="hero__bottom" />
      <h1>
        <span className="line l1">
          <span data-line="" style={i(0)}>
            Learn AI,
          </span>
        </span>
        <span className="line l2">
          <span data-line="" style={i(1)}>
            week by week
          </span>
        </span>
      </h1>
      <div className="stack" aria-label="Inside Wekaro: the Playbook, this week's news, and a practice question">
        <Link className="stk stk-pb" href="/courses/playbook" style={i(0)}>
          <img
            src="/hub/pb-cover.jpg"
            width={1600}
            height={893}
            alt="Cover of The Architect's Playbook: Enterprise LLM Architecture"
            fetchPriority="high"
          />
        </Link>
        <a className="stk stk-news" href="#news" data-ui="" style={i(1)}>
          <span className="k">This week in AI</span>
          <span className="t">Marketing tools ship MCP servers so Claude and ChatGPT can use them</span>
          <span className="m">Read this week’s five stories</span>
        </a>
        <a className="stk stk-q" href="#try" data-ui="" style={i(2)}>
          <span className="k">Try a question</span>
          <span className="t">What stop_reason tells you Claude wants to use a tool?</span>
          <span className="o">
            <b>A</b>end_turn
          </span>
          <span className="o ok">
            <b>C</b>tool_use
          </span>
        </a>
      </div>
      <div className="hero__foot">
        <p>
          For self-taught builders, in Nigeria and beyond. Weekly AI news, courses in order, and a plan you can
          follow. Free to start.
        </p>
        <div className="act">
          <Link className="btn btn--ink" href="/signup">
            Start free
          </Link>
          <a className="link" href="#courses">
            See the courses
          </a>
        </div>
      </div>
      <a className="marquee" href="#news" aria-label="This week in AI: read the five stories">
        <div className="marquee__track" aria-hidden="true">
          <MarqueeSet />
          <MarqueeSet />
        </div>
      </a>
    </section>
  );
}

function How() {
  return (
    <section className="how" id="how" aria-labelledby="how-h">
      <Intro id="how-h" title="How Wekaro works">
        Three habits, a few hours a week, on your phone or your laptop.
      </Intro>
      <div className="grid">
        <ol className="how__steps">
          <li data-reveal>
            <h3>Read the week’s news</h3>
            <p>The stories that matter in AI, in plain words, with what each one means for you.</p>
            <a className="link" href="#news">
              This week’s read
            </a>
          </li>
          <li data-reveal style={d(1)}>
            <h3>Follow a course, one week at a time</h3>
            <p>We pick the best free material, put it in order, and fill in what’s missing.</p>
            <a className="link" href="#courses">
              See the courses
            </a>
          </li>
          <li data-reveal style={d(2)}>
            <h3>Practise and watch yourself grow</h3>
            <p>A quiz after each week, XP for everything you finish, and a streak that brings you back.</p>
            <a className="link" href="#app">
              Inside the app
            </a>
          </li>
        </ol>
        <p className="how__src" data-reveal>
          We pick from free material by <b>Anthropic</b>, <b>Hugging Face</b>, <b>DeepLearning.AI</b>,{" "}
          <b>Coursera</b>, <b>LangChain</b>, <b>Microsoft Learn</b> and more, then add the order, the practice and
          the plan.
        </p>
      </div>
    </section>
  );
}

function News() {
  return (
    <section className="news sec" id="news" aria-labelledby="news-h">
      <Intro id="news-h" title="This week in AI" aside={newsWeekNote}>
        What changed, and what it means for you. A short read, free every week.
      </Intro>
      <div className="grid">
        <div className="stories" data-reveal style={d(2)}>
          {newsStories.map((s, n) => (
            <Fold key={s.headline} group="news" open={n === 0} date={s.date} title={s.headline}>
              <p>{s.body}</p>
              <p>
                <b>What it means for you:</b> {s.meaning}
              </p>
            </Fold>
          ))}
        </div>
        {/* TODO: no archive yet; this points back at this week until past weeks are published. */}
        <p className="news__more">
          <a className="link" href="#news">
            Read past weeks
          </a>
        </p>
        <EmailForm
          list="newsletter"
          className="sub"
          rowClassName="sub__row"
          button="Subscribe"
          done="You’re on the list"
          intro={
            <div className="sub__txt">
              <h3>Get this in your inbox</h3>
              <p>One email every Monday: the week in AI and what it means for you. Free, and easy to leave.</p>
            </div>
          }
        />
      </div>
    </section>
  );
}

function Courses() {
  return (
    <section className="shelf sec" id="courses" aria-labelledby="courses-h">
      <Intro id="courses-h" title="Courses and reads" aside="New courses and reads join the shelf as they open.">
        Start any course free. Pay only when you want the whole thing.
      </Intro>
      <Shelf />
      <div className="grid">
        <div className="gift" data-reveal>
          <img
            src="/hub/pb-layers.jpg"
            width={1000}
            height={450}
            loading="lazy"
            alt="A page from The Architect’s Playbook: a layered architecture diagram"
          />
          <div>
            <h3>Not ready to start? Take a free chapter.</h3>
            <p>
              Get the structured data extraction chapter of The Architect’s Playbook by email, with the weekly AI
              read. Leave any time.
            </p>
            <EmailForm list="free-chapter" className="gift__row" button="Send me the chapter" done="On its way" />
            <p className="note">Sample offer, to be confirmed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const heat = "x.xs.x.xx.sx.x.xsx.xxxxxxsxx";

function App() {
  return (
    <section className="app sec" id="app" aria-labelledby="app-h">
      <Intro id="app-h" title="Inside the app" aside="A sample account, to show how it looks.">
        Every course runs on one dashboard, so you can see yourself getting better.
      </Intro>
      <div className="grid">
        <div
          className="dash"
          data-ui=""
          role="img"
          aria-label="A sample Wekaro dashboard: level 4, Tool Wielder, 1,480 XP, a 9 day streak, 6 of 19 badges and this week’s check-in"
          data-reveal
        >
          <div className="dash__in">
            <div className="d-top">
              <span>Good evening, Ada</span>
              <span>Week 9 of 26</span>
            </div>
            <div className="d-lvl">
              <div>
                <span className="d-k">Level 4</span>
                <b>Tool Wielder</b>
              </div>
              <div className="d-xp">
                <b>1,480 XP</b>
                <span>520 to MCP Builder</span>
              </div>
            </div>
            <div className="d-bar">
              <i />
            </div>
            <div className="d-row">
              <div className="d-tile hot">
                <span className="d-k">Streak</span>
                <b>9 days</b>
                <span>XP counts 1.5x</span>
              </div>
              <div className="d-tile">
                <span className="d-k">Badges</span>
                <b>6 of 19</b>
                <span>Next: Monthly Machine</span>
              </div>
              <div className="d-tile">
                <span className="d-k">Practice exam</span>
                <b>780</b>
                <span>Pass mark 720</span>
              </div>
            </div>
            <div>
              <span className="d-k">Study days, last four weeks</span>
              <div className="d-heat" style={{ marginTop: ".5em" }}>
                {heat.split("").map((c, n) => (
                  <i key={n} className={c === "x" ? "on" : c === "s" ? "some" : undefined} />
                ))}
              </div>
            </div>
            <div className="d-badges">
              {["First Steps", "First Flame", "Week Warrior", "Foundation Layer", "First Build", "Domain Master: D4"].map(
                (b) => (
                  <span key={b}>{b}</span>
                )
              )}
            </div>
            <div className="d-check">
              <span>
                <b>Weekly check-in</b>What worked this week?
              </span>
              <span className="d-btn">+25 XP</span>
            </div>
          </div>
        </div>
        <ul className="app__list">
          <li data-reveal>
            <h3>XP for what you finish</h3>
            <p>25 for a reading, 75 for a quiz, 200 for something you build.</p>
          </li>
          <li data-reveal style={d(1)}>
            <h3>Ten levels</h3>
            <p>From Curious Beginner to AI Master, with a small party at each one.</p>
          </li>
          <li data-reveal style={d(2)}>
            <h3>Streaks that pay</h3>
            <p>Study seven days in a row and your XP counts one and a half times. Thirty days, double.</p>
          </li>
          <li data-reveal style={d(3)}>
            <h3>19 badges and a check-in</h3>
            <p>Badges for streaks, quizzes and builds, and a two-minute weekly check-in worth 25 XP.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Pick() {
  return (
    <section className="pick sec" id="start-here" aria-labelledby="pick-h">
      <Intro id="pick-h" title="Where do I start?">
        Answer three quick questions and we’ll point you to one course to begin with.
      </Intro>
      <div className="grid">
        <Picker />
      </div>
    </section>
  );
}

function Paying() {
  return (
    <section className="pay sec" id="paying" aria-labelledby="pay-h">
      <Intro id="pay-h" title="How paying works">
        Start free. Pay once for what you want to keep.
      </Intro>
      <div className="grid">
        <div className="pay__cols">
          <div data-reveal>
            <h3>Free</h3>
            <p>The first week of every course, the weekly AI news, and practice questions. No card needed.</p>
          </div>
          <div data-reveal style={d(1)}>
            <h3>Pay once</h3>
            <p>Get the whole of a course or read with one payment. No subscription, and it stays on your account.</p>
          </div>
          <div data-reveal style={d(2)}>
            <h3>₦ or $</h3>
            <p>Pay in naira or US dollars, by card or bank transfer, through Paystack.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Try() {
  return (
    <section className="try sec" id="try" aria-labelledby="try-h">
      <Intro id="try-h" title="Answer one now">
        Pick a topic. Each question comes from the Architect course quizzes, with the explanation.
      </Intro>
      <div className="grid">
        <TryQuestion />
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className="faq sec" id="questions" aria-labelledby="faq-h">
      <Intro id="faq-h" title="Questions">
        The ones people ask first. Something else? Write to us and a person will answer.
      </Intro>
      <div className="grid">
        <div className="stories qa" data-reveal style={d(2)}>
          {homeFaq.map(([q, a], n) => (
            <Fold key={q} group="faq" open={n === 0} title={q}>
              <p>{a}</p>
            </Fold>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The public homepage, shown to visitors who have not paid. */
export function HubHome() {
  return (
    <HubShell>
      <SiteHeader home />
      <Hero />
      <main>
        <How />
        <News />
        <Courses />
        <App />
        <Pick />
        <Paying />
        <Try />
        <Questions />
        <section className="cta" id="start" aria-labelledby="start-h">
          <h2 id="start-h" data-reveal>
            Start this week
          </h2>
          <div className="cta__side" data-reveal style={d(1)}>
            <p>Make a free account. Your progress saves from the first thing you tick.</p>
            <Link className="btn btn--ink" href="/signup">
              Start free
            </Link>
          </div>
        </section>
      </main>
      <StickBar heroId="top" endId="start" />
      <SiteFooter home />
    </HubShell>
  );
}
