/**
 * The Wekaro shelf: every course and read in one list.
 *
 * This list drives the course shelf on the homepage, the "Where do I start?"
 * picker, and the public course pages at /courses/[slug] (statically generated).
 * To add a course or read, add one entry with a new slug.
 */

/** Card colour: each maps to a background/ink pair in hub.css. */
export type CourseColour = "k-black" | "k-grey" | "k-mint" | "k-green" | "k-orange";

export type Course = {
  /** URL slug: the page lives at /courses/<slug>. */
  slug: string;
  title: string;
  kind: "course" | "read";
  /** Not open yet: shows "Tell me when it opens" instead of a price plan. */
  soon?: boolean;
  /** Free in full with an account: one free plan, no price and no checkout. */
  free?: boolean;
  colour: CourseColour;
  /** The folder tab label on the card. */
  tab: string;
  /** What the card picture shows: a week card from the app, the Playbook cover, or the outline. */
  media: "week" | "playbook" | "outline";
  /** One or two lines for the card. */
  short: string;
  /** The longer pitch at the top of the course page. */
  promise: string;
  price: string;
  /** Full price, shown on the "whole thing" plan. Only for courses that are open. */
  full?: string;
  cta: string;
  note: string;
  /** [big number, what it counts] */
  facts: [string, string][];
  /** Week-by-week phases (week-based courses). */
  phases?: { name: string; weeks: string[] }[];
  /** [heading, one line] for each part (reads and courses still being made). */
  outline?: [string, string][];
  /** [file in /public/hub, alt text] sample pages. */
  pages?: [string, string][];
  freeGets?: string[];
  fullGets?: string[];
  /** [question, answer] */
  faq: [string, string][];
};

export const courses: Course[] = [
  {
    slug: "architect",
    title: "Claude Certified Architect",
    kind: "course",
    colour: "k-black",
    tab: "Course, 26 weeks",
    media: "week",
    short: "A week-by-week plan for the Architect exam, with quizzes and a practice exam scored like the real one.",
    promise: "A week-by-week plan for the Claude Certified Architect exam. We pick the best free material, put it in order, and add quizzes, a practice exam scored like the real one, and progress that keeps you going.",
    price: "Free to start. Full course ₦20,000 or $15, once.",
    full: "₦20,000 or $15",
    cta: "Start week one free",
    note: "Independent. Not affiliated with Anthropic.",
    facts: [
      ["26", "weeks in five phases"],
      ["150", "resources, in order"],
      ["30", "question practice exam"],
      ["720", "out of 1000 to pass"]
    ],
    phases: [
      {
        name: "AI Foundations",
        weeks: [
          "The big picture",
          "Generative AI and your first API call",
          "Prompt engineering foundations",
          "AI agents and low-code tools"
        ]
      },
      {
        name: "AI Engineering Deep Dive",
        weeks: [
          "Git, GitHub and tool use",
          "MCP fundamentals",
          "Advanced MCP and agent skills",
          "Claude Code mastery",
          "Hugging Face and open-source models",
          "LangChain and orchestration",
          "RAG and multi-agent systems",
          "Structured output and data extraction"
        ]
      },
      {
        name: "Architect Exam Sprint",
        weeks: [
          "Domain 1: agentic architecture",
          "Domains 2 and 3: tools, MCP and Claude Code",
          "Domain 4: prompt engineering",
          "Domain 5: context and reliability",
          "Scenarios across all domains",
          "Mock exams and final review"
        ]
      },
      {
        name: "Production AI and LLMOps",
        weeks: ["LLMOps fundamentals", "Cloud AI platforms", "Advanced agent patterns", "Fine-tuning and open-source models"]
      },
      {
        name: "Portfolio and Career",
        weeks: [
          "Portfolio: a RAG assistant",
          "Portfolio: a SQL data analyst agent",
          "Teaching, content and LinkedIn",
          "Showcase and next steps"
        ]
      }
    ],
    freeGets: ["Week one in full: the big picture of AI", "The weekly AI news", "A practice question every day"],
    fullGets: [
      "All 26 weeks and 150 resources, in order",
      "Every weekly quiz and the 30-question practice exam",
      "Progress, streaks and badges to keep you going",
      "Every update we make to the course"
    ],
    faq: [
      ["Do I need to know how to code?", "Not to begin. Phase one starts from the basics, and you make your first call to an AI model in week two, step by step."],
      ["Is this the official exam course?", "No. Wekaro is independent and not affiliated with Anthropic. We point you to Anthropic’s own free courses and docs in a sensible order, and add practice on top."],
      ["How much time does it take?", "About five hours a week keeps you on the 26-week plan. Go slower or faster; your progress is saved either way."],
      ["What happens after I pay?", "The whole course unlocks on your account straight away. You pay once. There is no subscription."],
      ["Does the price include the exam?", "No. The exam itself is booked separately through Anthropic."]
    ]
  },
  {
    slug: "playbook",
    title: "The Architect’s Playbook",
    kind: "read",
    free: true,
    colour: "k-grey",
    tab: "PDF, 27 pages, free",
    media: "playbook",
    short: "How real teams ship LLM systems: patterns, anti-patterns and workflows, drawn as clear diagrams.",
    promise: "How real teams ship LLM systems: design patterns, the anti-patterns that sink them, and the workflows behind production deployments, drawn as clear diagrams you can come back to.",
    price: "Free with a free account.",
    cta: "Read it free",
    note: "No card needed.",
    facts: [
      ["27", "pages of diagrams and notes"],
      ["6", "big ideas, each drawn out"],
      ["1", "PDF, yours to keep"]
    ],
    outline: [
      ["Structured data extraction", "Turning messy documents into checked, reliable data."],
      ["Customer support agents", "When an agent should act, and when it should hand over."],
      ["Multi-agent systems", "Splitting work between agents without losing the thread."],
      ["Routing requests", "A funnel that sends each request to the right place."],
      ["Shared memory", "One store that every part of the system can trust."],
      ["Reading code at scale", "Why an agent should not read every file, and what to do instead."]
    ],
    pages: [
      ["pb-layers.jpg", "A layered architecture diagram"],
      ["pb-funnel.jpg", "A funnel that filters requests"],
      ["pb-files.jpg", "Why an agent should not read every file"],
      ["pb-memory.jpg", "A shared memory store"]
    ],
    freeGets: ["All 27 pages as a PDF you keep", "Every page we add later", "The weekly AI news"],
    faq: [
      ["What format is it?", "A PDF you download and keep. It reads well on a phone, a laptop or on paper."],
      ["Is it part of the Architect course?", "The Architect course uses it in two weeks. You can also get it on its own."]
    ]
  },
  {
    slug: "first-app",
    title: "Your first AI app",
    kind: "course",
    soon: true,
    colour: "k-mint",
    tab: "Course, coming soon",
    media: "outline",
    short: "Four weeks from no code to a working app that uses your own documents and is online to share.",
    promise: "A four-week course for complete beginners: from no code to a working app that talks to an AI model, uses your own documents, and is online for friends to try.",
    price: "Free while it’s new.",
    cta: "Tell me when it opens",
    note: "Sample course, to be confirmed.",
    facts: [
      ["4", "weeks, one step each"],
      ["0", "code needed to start"],
      ["1", "app online at the end"]
    ],
    outline: [
      ["First API call", "Send a message to an AI model and read the reply."],
      ["A chat interface", "Put a simple chat screen in front of it."],
      ["Your own documents", "Let it answer from files you choose."],
      ["Put it online", "Publish it so friends can try it on their phones."]
    ],
    faq: [
      ["When does it open?", "We’ll email you the day it opens. Leave your email below."],
      ["What will it cost?", "It’s free while it’s new."]
    ]
  },
  {
    slug: "agents",
    title: "Agents in production",
    kind: "course",
    soon: true,
    colour: "k-green",
    tab: "Course, coming soon",
    media: "outline",
    short: "For people who can build an agent and want it to survive real users, cost less and fail well.",
    promise: "For people who can already build an agent and want it to survive real users, cost less, and fail gracefully when something goes wrong.",
    price: "Price to come.",
    cta: "Tell me when it opens",
    note: "Sample course, to be confirmed.",
    facts: [
      ["4", "topics, each with a project"],
      ["1", "agent you harden as you go"]
    ],
    outline: [
      ["Evaluations", "Know whether a change made your agent better or worse."],
      ["Monitoring", "See what it does with real users, as it happens."],
      ["Cost control", "Spend less per task without losing quality."],
      ["When it goes wrong", "Retries, fallbacks and handing over to a person."]
    ],
    faq: [
      ["Who is it for?", "People who have built at least one agent. If that isn’t you yet, start with Your first AI app."],
      ["When does it open?", "We’ll email you the day it opens. Leave your email below."]
    ]
  },
  {
    slug: "prompting",
    title: "The prompting field guide",
    kind: "read",
    soon: true,
    colour: "k-orange",
    tab: "PDF, coming soon",
    media: "outline",
    short: "A short read on getting reliable answers: good examples, clear structure, and checking the result.",
    promise: "A short read on getting reliable answers from any AI model: good examples, clear structure, and how to check what comes back.",
    price: "Price to come.",
    cta: "Tell me when it’s out",
    note: "Sample read, to be confirmed.",
    facts: [
      ["4", "chapters"],
      ["1", "evening to read"]
    ],
    outline: [
      ["Roles and tone", "Tell the model who it is and who it is talking to."],
      ["Examples that work", "Show it what good looks like."],
      ["Asking for structure", "Get answers you can use straight away."],
      ["Checking the answer", "Catch mistakes before they cost you."]
    ],
    faq: [
      ["When is it out?", "We’ll email you the day it’s out. Leave your email below."]
    ]
  }
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function courseHref(c: Pick<Course, "slug">): string {
  return `/courses/${c.slug}`;
}

/** The button colour that reads on each card colour (never white on orange). */
export function courseButtonClass(c: Pick<Course, "colour">): string {
  if (c.colour === "k-black") return "btn--orange";
  if (c.colour === "k-green") return "";
  return "btn--ink";
}

/** "See the course", "See the read", or "See what’s coming". */
export function courseLinkLabel(c: Pick<Course, "soon" | "kind">): string {
  return c.soon ? "See what’s coming" : `See the ${c.kind}`;
}
