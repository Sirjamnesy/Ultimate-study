/**
 * Copy for the public homepage that changes week to week: the AI news, the
 * marquee headlines and the "Answer one now" questions.
 * Courses live in ./courses.ts.
 */

export type NewsStory = {
  date: string;
  headline: string;
  /** What happened, with the source. */
  body: string;
  /** "What it means for you". */
  meaning: string;
};

/** Sample week: real stories from 9 to 17 October 2026. */
export const newsWeekNote = "Sample week: real stories from 9 to 17 October 2026.";

export const newsStories: NewsStory[] = [
  {
    date: "17 October",
    headline: "Anthropic’s Jack Clark tells US policymakers AI is improving fast",
    body: "Speaking to policymakers, Anthropic’s co-founder said AI’s impact is accelerating quickly and could vastly boost US economic output. (Reuters, 17 October 2026.)",
    meaning:
      "the people building these models expect the jump to continue. Skills you learn this year will still be the floor next year, not the ceiling.",
  },
  {
    date: "16 October",
    headline: "AI stocks fall as investors question the debt behind data centres",
    body: "The Nasdaq fell more than 2% on Friday. CoreWeave dropped 12%, its second big fall in three days, on worries about its debt, and chip stocks slid with it. (Reuters and CNN, 16 October 2026.)",
    meaning:
      "the money side of AI is jumpy. Employers still pay for people who can ship working systems, so keep building things you can show.",
  },
  {
    date: "15 October",
    headline: "Marketing tools ship MCP servers so Claude and ChatGPT can use them",
    body: "In one week, a long list of marketing and sales products launched MCP servers and connectors, letting chat assistants search their data and run tasks. (MarTech, 15 October 2026.)",
    meaning:
      "MCP has become the normal way to plug tools into AI. If you can build an MCP server, you can work on almost any of these products.",
  },
  {
    date: "15 October",
    headline: "OpenSSL’s queue nearly doubles as AI finds more bugs",
    body: "Open pull requests on OpenSSL reached 558 at the start of October, up from 309 a year earlier. Maintainers said they use AI as an auditor, not an author. (Cyber Magazine, October 2026.)",
    meaning:
      "AI is good at finding problems and still needs people to judge the fixes. Reviewing AI output is a skill worth practising on purpose.",
  },
  {
    date: "9 October",
    headline: "Berkeley study: leaning on AI makes people give up sooner on hard problems",
    body: "Researchers found that a short spell of AI help on maths and reasoning tasks made people less willing to persist once the help was taken away. (UC Berkeley News, 9 October 2026.)",
    meaning:
      "try the hard part yourself first, then check with AI. That is why every week here ends with a quiz you answer alone.",
  },
];

/** Short headlines for the strip along the bottom of the hero. */
export const marqueeHeadlines = [
  "Jack Clark tells US policymakers AI is improving fast",
  "AI stocks fall as investors question data-centre debt",
  "Marketing tools ship MCP servers",
  "OpenSSL’s queue nearly doubles as AI finds more bugs",
  "Leaning on AI makes people give up sooner, Berkeley finds",
];

export type TryQuestion = {
  topic: string;
  question: string;
  from: string;
  options: [string, string, string, string];
  /** Index of the right option. */
  correct: number;
  why: string;
};

export const tryQuestions: TryQuestion[] = [
  {
    topic: "Agents",
    question: "What stop_reason tells you Claude wants to use a tool?",
    from: "Architect course, agents quiz",
    options: ["end_turn", "max_tokens", "tool_use", "stop_sequence"],
    correct: 2,
    why: "When Claude returns stop_reason: 'tool_use', it wants to call one or more tools. Your code runs them and sends back the results.",
  },
  {
    topic: "Tools",
    question: "What does tool_choice: 'auto' mean in the Anthropic API?",
    from: "Architect course, tools quiz",
    options: [
      "Claude must use at least one tool",
      "Claude picks tools without any instructions",
      "Claude decides whether to use a tool or answer directly",
      "A random tool is selected",
    ],
    correct: 2,
    why: "'auto' is the default: Claude decides from the conversation whether to call a tool or reply directly.",
  },
  {
    topic: "Claude Code",
    question: "What is a CLAUDE.md file for?",
    from: "Architect course, Claude Code quiz",
    options: [
      "It replaces the README",
      "It gives Claude Code the project’s instructions, conventions and context",
      "It stores API keys",
      "It configures the build",
    ],
    correct: 1,
    why: "Claude Code reads CLAUDE.md to learn a codebase’s conventions, architecture decisions and how to work in it.",
  },
  {
    topic: "Prompting",
    question: "What is chain-of-thought prompting?",
    from: "Architect course, prompting quiz",
    options: [
      "Sending several API calls in a row",
      "Asking Claude to reason step by step before answering",
      "Connecting several models together",
      "A way to cut API costs",
    ],
    correct: 1,
    why: "Asking for the reasoning step by step breaks a hard task into smaller ones and improves accuracy.",
  },
  {
    topic: "Context",
    question: "Why manage the context window in a long agent session?",
    from: "Architect course, context quiz",
    options: [
      "To raise the API rate limit",
      "To stay within token limits while keeping what matters, by summarising and pruning",
      "To translate between languages",
      "To save money on API calls",
    ],
    correct: 1,
    why: "Long sessions pile up tokens. Summarising, pruning old tool results and favouring recent context keeps the agent within limits and on track.",
  },
];

export const homeFaq: [string, string][] = [
  [
    "Is it really free to start?",
    "Yes. The weekly AI news, the practice questions and the first week of every course are free, with no card. You pay only when you want the whole of a course or read, and then you pay once.",
  ],
  [
    "Does it work on my phone?",
    "Yes, it’s made for phones first. Read, tick things off and take quizzes wherever you are. Your progress saves to your account, so you can carry on from a laptop later.",
  ],
  [
    "Do I get a certificate?",
    "Not from Wekaro. You earn levels and badges as you go, and we’re building a profile page you can share. The Architect course prepares you for Anthropic’s own Claude Certified Architect exam, which is where the certificate comes from. Wekaro is independent and not affiliated with Anthropic.",
  ],
  [
    "Do I need a laptop?",
    "Not to start. The news, the reading and the quizzes all work on a phone. When a course asks you to build something, a laptop makes it much easier, and we tell you the week before.",
  ],
];
