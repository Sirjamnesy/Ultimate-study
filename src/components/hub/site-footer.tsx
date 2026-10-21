import Link from "next/link";
import { EmailForm } from "./email-form";
import { socials, Use } from "./icons";

function Item({ href, children }: { href: string; children: React.ReactNode }) {
  // In-page anchors stay plain links; routes use client navigation.
  return (
    <li>
      {href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>}
    </li>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  const at = home ? "" : "/";
  return (
    <footer className="ft">
      <div className="ft__top">
        <div className="ft__news">
          <h2>Get the weekly AI read</h2>
          <p>One email each week: what changed in AI and what it means for you. Free, and easy to leave.</p>
          <EmailForm list="newsletter" className="ft__form" button="Subscribe" done="Thanks" buttonClassName="btn" />
        </div>
        <div className="ft__cols">
          <div>
            <b>Learn</b>
            <ul>
              <Item href={`${at}#news`}>AI news</Item>
              <Item href={`${at}#courses`}>Courses</Item>
              <Item href="/courses/playbook">The Playbook</Item>
              <Item href={`${at}#try`}>Try a question</Item>
            </ul>
          </div>
          <div>
            <b>Wekaro</b>
            <ul>
              <Item href="/signup">Start free</Item>
              <Item href="/login">Sign in</Item>
              <Item href="#questions">Questions</Item>
              {/* TODO: About and Contact pages do not exist yet. */}
              <Item href="#about">About</Item>
              <Item href="#contact">Contact</Item>
            </ul>
          </div>
          <div>
            <b>Follow along</b>
            <ul className="soc-list">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.href}>
                    <Use id={s.id} />
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {home ? (
        <a className="ft__word" href="#top" aria-label="Wekaro, back to top">
          <Use id="r1" />
          <span aria-hidden="true">wekaro</span>
        </a>
      ) : (
        <Link className="ft__word" href="/" aria-label="Wekaro, home">
          <Use id="r1" />
          <span aria-hidden="true">wekaro</span>
        </Link>
      )}
      <div className="ft__legal">
        <p>© 2026 Wekaro. Independent. Not affiliated with Anthropic.</p>
        <p>Diagrams from The Architect’s Playbook. News stories credit their publishers.</p>
      </div>
    </footer>
  );
}
