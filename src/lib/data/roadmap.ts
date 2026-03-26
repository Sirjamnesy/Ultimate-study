export type Resource = {
  id: string;
  title: string;
  url?: string;
  type: "course" | "docs" | "video" | "practice" | "build" | "quiz" | "reading";
  duration?: string;
  source?: string;
  optional?: boolean;
};

export type Week = {
  id: number;
  title: string;
  phase: number;
  description: string;
  xp: number;
  badge?: string;
  examDomains?: number[];
  resources: Resource[];
};

export type Phase = {
  id: number;
  title: string;
  description: string;
  weeks: number[];
  color: string;
};

export const phases: Phase[] = [
  {
    id: 1,
    title: "AI Foundations",
    description: "Build your understanding of AI, generative AI, and your first API calls",
    weeks: [1, 2, 3, 4],
    color: "emerald",
  },
  {
    id: 2,
    title: "AI Engineering Deep Dive",
    description: "Master tools, MCP, agents, RAG, and production AI patterns",
    weeks: [5, 6, 7, 8, 9, 10, 11, 12],
    color: "blue",
  },
  {
    id: 3,
    title: "Architect Exam Sprint",
    description: "6-week intensive prep for the Claude Certified Architect exam",
    weeks: [13, 14, 15, 16, 17, 18],
    color: "violet",
  },
  {
    id: 4,
    title: "Production AI & LLMOps",
    description: "Deploy, monitor, and scale AI systems in production",
    weeks: [19, 20, 21, 22],
    color: "amber",
  },
  {
    id: 5,
    title: "Portfolio & Career",
    description: "Build portfolio projects and launch your AI engineering career",
    weeks: [23, 24, 25, 26],
    color: "rose",
  },
];

export const weeks: Week[] = [
  // ===== PHASE 1: AI Foundations (Weeks 1-4) =====
  {
    id: 1,
    title: "The Big Picture",
    phase: 1,
    description: "Understand what AI is, how it works, and where it's going",
    xp: 200,
    badge: "First Steps",
    resources: [
      { id: "w1-1", title: "AI for Everyone (Andrew Ng)", url: "https://www.coursera.org/learn/ai-for-everyone", type: "course", duration: "6hr", source: "Notion: Ultimate AI Journey" },
      { id: "w1-2", title: "Elements of AI (Helsinki)", url: "https://www.elementsofai.com/", type: "course", duration: "30hr", source: "Notion: Ultimate AI Journey" },
      { id: "w1-3", title: "Anthropic Skilljar: Claude 101", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w1-4", title: "Anthropic Skilljar: AI Fluency Framework & Foundations", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w1-5", title: "Python for Everybody (Coursera)", url: "https://www.coursera.org/specializations/python", type: "course", optional: true, source: "Notion: AI/ML Roadmap" },
      { id: "w1-6", title: "3Blue1Brown: Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "video", optional: true, source: "Notion: AI/ML Roadmap" },
      { id: "w1-q", title: "Quiz: AI Fundamentals (10 questions)", type: "quiz" },
    ],
  },
  {
    id: 2,
    title: "Generative AI & First API Call",
    phase: 1,
    description: "Learn how generative AI works and make your first Claude API call",
    xp: 250,
    examDomains: [4],
    resources: [
      { id: "w2-1", title: "Generative AI for Everyone (Andrew Ng)", url: "https://www.coursera.org/learn/generative-ai-for-everyone", type: "course", source: "Notion Phase 2" },
      { id: "w2-2", title: "Microsoft: Generative AI for Beginners (21 lessons)", url: "https://github.com/microsoft/generative-ai-for-beginners", type: "course", source: "Notion Phase 2" },
      { id: "w2-3", title: "Anthropic Skilljar: Building with Claude API", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w2-4", title: "Anthropic docs: Messages API, API Reference, Models", url: "https://docs.anthropic.com/en/api", type: "docs" },
      { id: "w2-5", title: "Build: First API call - vary params (temperature, max_tokens)", type: "build" },
      { id: "w2-q", title: "Quiz: GenAI concepts + API basics (10 questions)", type: "quiz" },
    ],
  },
  {
    id: 3,
    title: "Prompt Engineering Foundations",
    phase: 1,
    description: "Master the art of communicating effectively with AI models",
    xp: 300,
    examDomains: [4],
    resources: [
      { id: "w3-1", title: "Prompt Engineering for ChatGPT (Vanderbilt)", url: "https://www.coursera.org/learn/prompt-engineering", type: "course", duration: "18hr", source: "Notion Phase 2" },
      { id: "w3-2", title: "Anthropic docs: Prompt Engineering guide (14 sub-pages)", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering", type: "docs" },
      { id: "w3-3", title: "Anthropic Cookbook: prompt engineering tutorials", url: "https://github.com/anthropics/anthropic-cookbook", type: "practice" },
      { id: "w3-4", title: "Practice: 10 prompt challenges (few-shot, CoT, system prompts, XML)", type: "practice" },
      { id: "w3-q", title: "Quiz: Prompt techniques (15 questions)", type: "quiz" },
    ],
  },
  {
    id: 4,
    title: "AI Agents Intro + Low-Code",
    phase: 1,
    description: "Understand agent fundamentals and build your first chatbot",
    xp: 400,
    badge: "Foundation Layer",
    resources: [
      { id: "w4-1", title: "HuggingFace AI Agents Course", url: "https://huggingface.co/learn/agents-course", type: "course", source: "Notion: Ultimate AI Journey" },
      { id: "w4-2", title: "HuggingFace NLP Course Ch.1 - Transformer Architecture", url: "https://huggingface.co/learn/nlp-course", type: "course", source: "Notion: AI/ML Roadmap" },
      { id: "w4-3", title: "Microsoft: AI Agents for Beginners (10 lessons)", url: "https://github.com/microsoft/ai-agents-for-beginners", type: "course", source: "Notion: Ultimate AI Journey" },
      { id: "w4-4", title: "n8n Academy Level One - first automation", url: "https://docs.n8n.io/courses/level-one/", type: "course", source: "Notion: Ultimate AI Journey" },
      { id: "w4-5", title: "Read: Anthropic docs - Models, Pricing, Context Windows", url: "https://docs.anthropic.com/en/docs/about-claude/models", type: "docs" },
      { id: "w4-6", title: "Build: Simple CLI chatbot using Anthropic SDK", type: "build" },
      { id: "w4-q", title: "Phase 1 Review Quiz: 20 questions across all weeks", type: "quiz" },
    ],
  },

  // ===== PHASE 2: AI Engineering Deep Dive (Weeks 5-12) =====
  {
    id: 5,
    title: "Git/GitHub + Tool Use",
    phase: 2,
    description: "Version control essentials and Claude tool use fundamentals",
    xp: 350,
    examDomains: [2],
    resources: [
      { id: "w5-1", title: "Git/GitHub essentials: repos, push, commit, branches", url: "https://git-scm.com/doc", type: "course", source: "Baraa: GitHub" },
      { id: "w5-2", title: "GitHub Getting Started docs", url: "https://docs.github.com/en/get-started", type: "docs", source: "Baraa: GitHub" },
      { id: "w5-3", title: "Anthropic docs: Tool Use guide (all sub-pages)", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", type: "docs" },
      { id: "w5-4", title: "Anthropic Cookbook: tool_use/ tutorials", url: "https://github.com/anthropics/anthropic-cookbook/tree/main/tool_use", type: "practice" },
      { id: "w5-5", title: "Build: Multi-tool agent (3+ tools with JSON schemas)", type: "build" },
      { id: "w5-q", title: "Quiz: Git basics + Tool schemas (15 questions)", type: "quiz" },
    ],
  },
  {
    id: 6,
    title: "MCP Fundamentals",
    phase: 2,
    description: "Learn the Model Context Protocol from the ground up",
    xp: 400,
    examDomains: [2],
    resources: [
      { id: "w6-1", title: "Anthropic Skilljar: Introduction to MCP", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w6-2", title: "MCP docs: Architecture, Specification, Transports", url: "https://modelcontextprotocol.io/docs", type: "docs" },
      { id: "w6-3", title: "MCP docs: Build Client & Build Server tutorials", url: "https://modelcontextprotocol.io/docs", type: "docs" },
      { id: "w6-4", title: "Build: Basic MCP server (resource + tool)", type: "build" },
      { id: "w6-q", title: "Quiz: MCP protocol, transports, server/client (15 questions)", type: "quiz" },
    ],
  },
  {
    id: 7,
    title: "MCP Advanced + Agent Skills",
    phase: 2,
    description: "Advanced MCP patterns, security, and Agent Skills",
    xp: 400,
    examDomains: [2, 3],
    resources: [
      { id: "w7-1", title: "Anthropic Skilljar: MCP Advanced Topics", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w7-2", title: "Anthropic Skilljar: Introduction to Agent Skills", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w7-3", title: "MCP docs: Security, Sampling, Roots, Prompts/Resources", url: "https://modelcontextprotocol.io/docs", type: "docs" },
      { id: "w7-4", title: "GitHub: anthropics/skills repo - SKILL.md format", url: "https://github.com/anthropics/skills", type: "docs" },
      { id: "w7-5", title: "Build: MCP server with auth + custom Agent Skill", type: "build" },
      { id: "w7-q", title: "Quiz: MCP security, skills, advanced patterns (15 questions)", type: "quiz" },
    ],
  },
  {
    id: 8,
    title: "Claude Code Mastery",
    phase: 2,
    description: "Master Claude Code configuration, hooks, and workflows",
    xp: 400,
    examDomains: [3],
    resources: [
      { id: "w8-1", title: "Anthropic Skilljar: Claude Code in Action (6 hours)", url: "https://skilljar.anthropic.com", type: "course", duration: "6hr" },
      { id: "w8-2", title: "Anthropic Skilljar: Introduction to Claude Cowork", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w8-3", title: "Anthropic docs: Claude Code - Config, CLI, Hooks, Permissions", url: "https://docs.anthropic.com/en/docs/claude-code", type: "docs" },
      { id: "w8-4", title: "Practice: Configure project with CLAUDE.md hierarchy, commands, rules", type: "practice" },
      { id: "w8-q", title: "Quiz: Claude Code configuration, hooks, plan mode (15 questions)", type: "quiz" },
    ],
  },
  {
    id: 9,
    title: "Hugging Face + Open-Source Models",
    phase: 2,
    description: "Explore the open-source AI ecosystem and transformer models",
    xp: 350,
    resources: [
      { id: "w9-1", title: "Explore models on Hugging Face Hub", url: "https://huggingface.co/models", type: "practice", source: "Baraa: Hugging Face" },
      { id: "w9-2", title: "Learn transformers library - pipelines for text tasks", url: "https://huggingface.co/learn", type: "course", source: "Baraa: Hugging Face" },
      { id: "w9-3", title: "DataCamp Hugging Face course", url: "https://www.datacamp.com", type: "course", source: "Baraa: Hugging Face" },
      { id: "w9-4", title: "HuggingFace AI Agents Course (continued)", url: "https://huggingface.co/learn/agents-course", type: "course", source: "Notion: Ultimate AI Journey" },
      { id: "w9-5", title: "Build: Text classification with HuggingFace model", type: "build" },
      { id: "w9-q", title: "Quiz: Open-source models, transformers, model hub (10 questions)", type: "quiz" },
    ],
  },
  {
    id: 10,
    title: "LangChain + AI Orchestration",
    phase: 2,
    description: "Learn LangChain for building multi-step AI workflows",
    xp: 400,
    resources: [
      { id: "w10-1", title: "LangChain core: chains, tools, memory, agents", url: "https://langchain.com", type: "course", source: "Baraa: LangChain" },
      { id: "w10-2", title: "LangChain YouTube tutorials + gkamradt guides", url: "https://www.youtube.com/@LangChain", type: "video", source: "Baraa: LangChain" },
      { id: "w10-3", title: "Connect multiple models in one LangChain workflow", type: "practice", source: "Baraa: LangChain" },
      { id: "w10-4", title: "Build: Multi-step automation with LangChain", type: "build" },
      { id: "w10-q", title: "Quiz: LangChain concepts, chains, orchestration (10 questions)", type: "quiz" },
    ],
  },
  {
    id: 11,
    title: "RAG + Multi-Agent Orchestration",
    phase: 2,
    description: "Build RAG systems and orchestrate multiple AI agents",
    xp: 500,
    examDomains: [1],
    resources: [
      { id: "w11-1", title: "RAG fundamentals: chunking, embeddings, vector DBs", url: "https://aws.amazon.com/what-is/retrieval-augmented-generation/", type: "docs", source: "Baraa: RAG" },
      { id: "w11-2", title: "LangChain RAG tutorial", url: "https://python.langchain.com/docs/tutorials/rag/", type: "practice", source: "Baraa: RAG" },
      { id: "w11-3", title: "Anthropic Skilljar: Introduction to Subagents", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w11-4", title: "Anthropic docs: Agent SDK (Overview, Agent Loop, Sessions)", url: "https://docs.anthropic.com/en/docs/agents", type: "docs" },
      { id: "w11-5", title: "Anthropic Cookbook: patterns/agents/ + claude_agent_sdk/", url: "https://github.com/anthropics/anthropic-cookbook", type: "practice" },
      { id: "w11-6", title: "DeepLearning.AI: Multi-AI Agents with CrewAI", url: "https://www.deeplearning.ai", type: "course", source: "Notion: Ultimate AI Journey" },
      { id: "w11-7", title: "DeepLearning.AI: AI Agents in LangGraph", url: "https://www.deeplearning.ai", type: "course", source: "Notion: Ultimate AI Journey" },
      { id: "w11-8", title: "Build: RAG-powered agent for document Q&A", type: "build" },
      { id: "w11-q", title: "Quiz: RAG architecture + Agent patterns (15 questions)", type: "quiz" },
    ],
  },
  {
    id: 12,
    title: "Structured Output & Data Extraction",
    phase: 2,
    description: "Extract structured data from unstructured content",
    xp: 500,
    badge: "AI Engineer",
    resources: [
      { id: "w12-1", title: "Anthropic docs: Structured Output, JSON mode, Streaming, Batch", url: "https://docs.anthropic.com/en/docs/build-with-claude/structured-output", type: "docs" },
      { id: "w12-2", title: "Anthropic Cookbook: Classification, RAG, Summarization", url: "https://github.com/anthropics/anthropic-cookbook", type: "practice" },
      { id: "w12-3", title: "Architect's Playbook: Structured Data Extraction (pages 2-9)", type: "reading" },
      { id: "w12-4", title: "Build: Data extraction pipeline (doc -> validated JSON)", type: "build" },
      { id: "w12-q", title: "Phase 2 Capstone Quiz: 30 questions", type: "quiz" },
    ],
  },

  // ===== PHASE 3: Architect Exam Sprint (Weeks 13-18) =====
  {
    id: 13,
    title: "Domain 1: Agentic Architecture (27%)",
    phase: 3,
    description: "Master agentic loops, orchestration patterns, and the Agent SDK",
    xp: 500,
    examDomains: [1],
    resources: [
      { id: "w13-1", title: "Re-read: Agent SDK docs (task statements 1.1-1.7)", url: "https://docs.anthropic.com/en/docs/agents", type: "docs" },
      { id: "w13-2", title: "Architect's Playbook: Customer Support + Multi-Agent Systems", type: "reading" },
      { id: "w13-3", title: "Exam Exercise 1: Multi-Tool Agent with Escalation Logic", type: "build" },
      { id: "w13-4", title: "Exam Exercise 4: Multi-Agent Research System", type: "build" },
      { id: "w13-5", title: "claudecertifications.com: Domain 1 practice questions", url: "https://claudecertifications.com", type: "practice" },
      { id: "w13-q", title: "Domain 1 Quiz: 20 questions (agentic loops, subagents, hooks)", type: "quiz" },
    ],
  },
  {
    id: 14,
    title: "Domain 2+3: Tools/MCP + Claude Code (38%)",
    phase: 3,
    description: "Deep dive into tool design, MCP configuration, and Claude Code",
    xp: 500,
    examDomains: [2, 3],
    resources: [
      { id: "w14-1", title: "Re-read: Tool Use + MCP docs (task statements 2.1-2.5)", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", type: "docs" },
      { id: "w14-2", title: "Re-read: Claude Code docs (task statements 3.1-3.6)", url: "https://docs.anthropic.com/en/docs/claude-code", type: "docs" },
      { id: "w14-3", title: "Exam Exercise 2: Configure Claude Code for Team Workflow", type: "build" },
      { id: "w14-4", title: "Architect's Playbook: Developer Productivity + MCP Tool Specificity", type: "reading" },
      { id: "w14-5", title: "claudecertifications.com: Domain 2+3 practice questions", url: "https://claudecertifications.com", type: "practice" },
      { id: "w14-6", title: "Build: Developer productivity tool with Claude Code", type: "build" },
      { id: "w14-q", title: "Domain 2+3 Quiz: 25 questions (tool design, MCP, CLAUDE.md)", type: "quiz" },
    ],
  },
  {
    id: 15,
    title: "Domain 4: Prompt Engineering (20%)",
    phase: 3,
    description: "Advanced prompt engineering and structured output patterns",
    xp: 500,
    examDomains: [4],
    resources: [
      { id: "w15-1", title: "Deep review: Prompt Engineering docs (task statements 4.1-4.6)", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering", type: "docs" },
      { id: "w15-2", title: "Architect's Playbook: Resilient Schemas, Normalization, Null Handling", type: "reading" },
      { id: "w15-3", title: "Exam Exercise 3: Structured Data Extraction Pipeline", type: "build" },
      { id: "w15-4", title: "claudecertifications.com: Domain 4 practice questions", url: "https://claudecertifications.com", type: "practice" },
      { id: "w15-5", title: "Build: Full extraction pipeline with validation + retry", type: "build" },
      { id: "w15-q", title: "Domain 4 Quiz: 20 questions (few-shot, JSON schemas, batch)", type: "quiz" },
    ],
  },
  {
    id: 16,
    title: "Domain 5: Context & Reliability (15%)",
    phase: 3,
    description: "Context management, guardrails, and reliability patterns",
    xp: 500,
    examDomains: [5],
    resources: [
      { id: "w16-1", title: "Anthropic docs: Context windows, Prompt Caching, Compaction", url: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows", type: "docs" },
      { id: "w16-2", title: "Anthropic docs: Guardrails (all sub-pages)", url: "https://docs.anthropic.com/en/docs/build-with-claude/guardrails", type: "docs" },
      { id: "w16-3", title: "Architect's Playbook: Compressing Sessions, Tool Context Pruning", type: "reading" },
      { id: "w16-4", title: "claudecertifications.com: Domain 5 practice questions", url: "https://claudecertifications.com", type: "practice" },
      { id: "w16-5", title: "Build: Research system with context management", type: "build" },
      { id: "w16-q", title: "Domain 5 Quiz: 15 questions (context pruning, escalation)", type: "quiz" },
    ],
  },
  {
    id: 17,
    title: "Scenario Mastery + Cross-Domain",
    phase: 3,
    description: "Practice all 6 exam scenarios with timed exercises",
    xp: 500,
    examDomains: [1, 2, 3, 4, 5],
    resources: [
      { id: "w17-1", title: "S1: Customer Support (D1, D2, D5) - timed exercise", type: "practice" },
      { id: "w17-2", title: "S2: Code Generation (D3, D5) - timed exercise", type: "practice" },
      { id: "w17-3", title: "S3: Multi-Agent Research (D1, D2, D5) - timed exercise", type: "practice" },
      { id: "w17-4", title: "S4: Developer Productivity (D2, D3, D1) - timed exercise", type: "practice" },
      { id: "w17-5", title: "S5: CI/CD with Claude Code (D3, D4) - timed exercise", type: "practice" },
      { id: "w17-6", title: "S6: Structured Data Extraction (D4, D5) - timed exercise", type: "practice" },
      { id: "w17-7", title: "Review all 12 sample exam questions + explanations", type: "practice" },
      { id: "w17-q", title: "Cross-domain quiz: 30 questions mixing all domains", type: "quiz" },
    ],
  },
  {
    id: 18,
    title: "Mock Exams & Final Review",
    phase: 3,
    description: "Full exam simulations - target 80%+ then take the exam!",
    xp: 1000,
    badge: "Exam Ready",
    examDomains: [1, 2, 3, 4, 5],
    resources: [
      { id: "w18-1", title: "Mock Exam 1: Full simulation (4 scenarios, timed, domain-weighted)", type: "practice" },
      { id: "w18-2", title: "Review weak areas from Mock 1", type: "practice" },
      { id: "w18-3", title: "Mock Exam 2: Full simulation", type: "practice" },
      { id: "w18-4", title: "Review weak areas from Mock 2", type: "practice" },
      { id: "w18-5", title: "Mock Exam 3: Final confidence check", type: "practice" },
      { id: "w18-6", title: "SCHEDULE AND TAKE THE EXAM", type: "practice" },
    ],
  },

  // ===== PHASE 4: Production AI & LLMOps (Weeks 19-22) =====
  {
    id: 19,
    title: "LLMOps Fundamentals",
    phase: 4,
    description: "Learn the AI operations lifecycle from idea to production",
    xp: 400,
    resources: [
      { id: "w19-1", title: "LLMOps lifecycle: idea to production to maintenance", type: "docs", source: "Baraa: LLMOps" },
      { id: "w19-2", title: "Track and analyze prompts and responses", type: "practice", source: "Baraa: LLMOps" },
      { id: "w19-3", title: "Test and optimize RAG performance", type: "practice", source: "Baraa: LLMOps" },
      { id: "w19-4", title: "LangChain Evaluation & Monitoring docs", url: "https://python.langchain.com/docs/guides/productionization/", type: "docs" },
      { id: "w19-5", title: "Build: Add monitoring/logging to an existing agent project", type: "build" },
      { id: "w19-q", title: "Quiz: LLMOps concepts, monitoring, cost tracking (10 questions)", type: "quiz" },
    ],
  },
  {
    id: 20,
    title: "Cloud AI Platforms",
    phase: 4,
    description: "Deploy AI on major cloud platforms",
    xp: 500,
    resources: [
      { id: "w20-1", title: "Anthropic Skilljar: Claude with Amazon Bedrock", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w20-2", title: "Anthropic Skilljar: Claude with Google Cloud Vertex AI", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w20-3", title: "CI/CD for model updates, alerts, dashboards", type: "practice", source: "Baraa: LLMOps" },
      { id: "w20-4", title: "Build: Deploy an AI feature to production with monitoring", type: "build" },
    ],
  },
  {
    id: 21,
    title: "Advanced Agent Patterns",
    phase: 4,
    description: "Complex multi-agent systems with handoffs and evaluation",
    xp: 500,
    resources: [
      { id: "w21-1", title: "Multi-agent orchestration with complex handoffs", type: "docs" },
      { id: "w21-2", title: "Agent evaluation and testing frameworks", type: "docs" },
      { id: "w21-3", title: "AI Agents: calling APIs, querying databases, triggering workflows", type: "practice", source: "Baraa: AI Agents" },
      { id: "w21-4", title: "DeepLearning.AI: Practical Multi-AI Agents (deep dive)", url: "https://www.deeplearning.ai", type: "course" },
      { id: "w21-5", title: "Build: Complex multi-agent system (research + writing + review)", type: "build" },
    ],
  },
  {
    id: 22,
    title: "Fine-Tuning & Open-Source Deep Dive",
    phase: 4,
    description: "Fine-tune models and deploy them safely",
    xp: 500,
    badge: "Production Engineer",
    resources: [
      { id: "w22-1", title: "Fine-tune existing models for a specific use case", url: "https://huggingface.co/learn", type: "course", source: "Baraa: Hugging Face" },
      { id: "w22-2", title: "Deploy models safely on Hugging Face", type: "practice", source: "Baraa: Hugging Face" },
      { id: "w22-3", title: "Anthropic Cookbook: finetuning/ tutorials", url: "https://github.com/anthropics/anthropic-cookbook", type: "practice" },
      { id: "w22-4", title: "Build: Fine-tune an open-source model on custom data", type: "build" },
    ],
  },

  // ===== PHASE 5: Portfolio & Career (Weeks 23-26) =====
  {
    id: 23,
    title: "Portfolio: RAG Assistant",
    phase: 5,
    description: "Build a 'Talk to Documents' app with PDF upload and citations",
    xp: 500,
    resources: [
      { id: "w23-1", title: "Build: PDF upload + Q&A with citations", type: "build", source: "Baraa: Portfolio" },
      { id: "w23-2", title: "Streamlit/Next.js chat interface with file upload", type: "build" },
      { id: "w23-3", title: "Vector database (Chroma or Pinecone)", type: "build" },
      { id: "w23-4", title: "Source citations and conversation memory", type: "build" },
      { id: "w23-5", title: "README with architecture diagram and demo", type: "build" },
    ],
  },
  {
    id: 24,
    title: "Portfolio: SQL Data Analyst Agent",
    phase: 5,
    description: "Build a natural language to SQL agent with visualization",
    xp: 500,
    resources: [
      { id: "w24-1", title: "Build: Natural language to SQL conversion", type: "build", source: "Baraa: Portfolio" },
      { id: "w24-2", title: "Table/chart output + summary text with findings", type: "build" },
      { id: "w24-3", title: "README with setup steps and demo GIF", type: "build" },
    ],
  },
  {
    id: 25,
    title: "Teaching, Content & LinkedIn",
    phase: 5,
    description: "Build your professional presence and teach what you've learned",
    xp: 400,
    resources: [
      { id: "w25-1", title: "Anthropic Skilljar: Teaching AI Fluency", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w25-2", title: "Anthropic Skilljar: AI Fluency for Educators", url: "https://skilljar.anthropic.com", type: "course" },
      { id: "w25-3", title: "Build LinkedIn profile: AI Engineer edition", type: "practice", source: "Baraa: LinkedIn" },
      { id: "w25-4", title: "Polish GitHub profile: bio, pinned repos, READMEs", type: "practice", source: "Baraa: Portfolio" },
      { id: "w25-5", title: "Write: Blog post or tutorial about your learning journey", type: "build" },
    ],
  },
  {
    id: 26,
    title: "Portfolio Showcase & Next Steps",
    phase: 5,
    description: "Polish everything and plan your next certification",
    xp: 500,
    badge: "AI Master",
    resources: [
      { id: "w26-1", title: "Polish all portfolio projects (RAG, SQL Agent, exam projects)", type: "practice" },
      { id: "w26-2", title: "Document architecture decisions and learnings", type: "practice" },
      { id: "w26-3", title: "Update this learning app as a portfolio showcase", type: "build" },
      { id: "w26-4", title: "Review: Azure AI-102, Databricks GenAI certifications", type: "docs", source: "Baraa: Certifications" },
      { id: "w26-5", title: "Create a 'What I Learned' presentation/video", type: "build" },
    ],
  },
];

export function getWeeksByPhase(phaseId: number): Week[] {
  return weeks.filter((w) => w.phase === phaseId);
}

export function getWeek(weekId: number): Week | undefined {
  return weeks.find((w) => w.id === weekId);
}

export function getPhase(phaseId: number): Phase | undefined {
  return phases.find((p) => p.id === phaseId);
}

export function getTotalResources(): number {
  return weeks.reduce((sum, w) => sum + w.resources.length, 0);
}

export function getTotalXP(): number {
  return weeks.reduce((sum, w) => sum + w.xp, 0);
}
