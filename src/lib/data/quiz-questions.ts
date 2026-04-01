// Quiz question seed data for the Ultimate Study app.
// Covers 5 exam domains + weekly topic quizzes.

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  domain?: number; // 1-5 for exam domains
  week?: number; // which week this belongs to
};

export type QuizDef = {
  id: string;
  title: string;
  description: string;
  domain?: number;
  week?: number;
  timeMinutes: number;
  passingScore: number; // percentage
  questions: string[]; // question IDs
};

// ============================
// QUESTIONS
// ============================

export const questions: QuizQuestion[] = [
  // ───── DOMAIN 1: Agentic Architecture & Orchestration (27%) ─────
  {
    id: "d1-1",
    question: "What is the primary purpose of the agentic loop in Claude's architecture?",
    options: [
      "To repeatedly prompt the user for more information",
      "To allow Claude to iteratively use tools, observe results, and decide next steps until a task is complete",
      "To run the same prompt multiple times and pick the best output",
      "To distribute tasks across multiple API endpoints simultaneously",
    ],
    correctIndex: 1,
    explanation: "The agentic loop lets Claude call tools, observe their results, and decide whether to continue with more tool calls or provide a final response. It enables multi-step reasoning.",
    domain: 1,
  },
  {
    id: "d1-2",
    question: "In a coordinator-subagent architecture, what is the coordinator's primary responsibility?",
    options: [
      "Executing all tools directly",
      "Decomposing tasks and delegating to specialized subagents",
      "Managing the database connections",
      "Handling user authentication",
    ],
    correctIndex: 1,
    explanation: "The coordinator breaks complex tasks into subtasks and delegates them to specialized subagents, each with focused capabilities and tools.",
    domain: 1,
  },
  {
    id: "d1-3",
    question: "When should you use session forking in a multi-agent system?",
    options: [
      "When you need to save memory",
      "When parallel subtasks need independent context that branches from a shared conversation state",
      "When the API returns an error",
      "When the user requests it explicitly",
    ],
    correctIndex: 1,
    explanation: "Session forking creates parallel conversation branches from a shared state, allowing multiple subagents to work independently on related subtasks.",
    domain: 1,
  },
  {
    id: "d1-4",
    question: "What stop_reason indicates Claude wants to use a tool?",
    options: [
      "end_turn",
      "max_tokens",
      "tool_use",
      "stop_sequence",
    ],
    correctIndex: 2,
    explanation: "When Claude returns stop_reason: 'tool_use', it means the model wants to call one or more tools. Your code should execute the tools and return results.",
    domain: 1,
  },
  {
    id: "d1-5",
    question: "What is the recommended approach for handling task decomposition in complex agent systems?",
    options: [
      "Let a single agent handle everything in one turn",
      "Break the task into smaller subtasks, each handled by a focused agent with specific tools",
      "Always use exactly three agents regardless of task complexity",
      "Send the entire task to multiple agents simultaneously and pick the fastest response",
    ],
    correctIndex: 1,
    explanation: "Complex tasks should be decomposed into smaller, focused subtasks. Each subagent should have a clear scope and relevant tools to avoid confusion and improve reliability.",
    domain: 1,
  },
  {
    id: "d1-6",
    question: "In the Agent SDK, how do you configure an agent's ability to delegate to subagents?",
    options: [
      "By passing a 'children' parameter in the API call",
      "By defining subagents in the Agent class configuration and allowing the coordinator to invoke them as tools",
      "By creating a separate API key for each subagent",
      "Subagents are not supported in the Agent SDK",
    ],
    correctIndex: 1,
    explanation: "The Agent SDK allows you to define subagents that the coordinator can invoke. Subagents appear as callable tools to the parent agent.",
    domain: 1,
  },
  {
    id: "d1-7",
    question: "What is the key difference between a 'tool call' and an 'agentic loop iteration'?",
    options: [
      "They are the same thing",
      "A tool call is a single invocation; an agentic loop iteration includes the tool call, result observation, and decision to continue or stop",
      "A tool call happens on the server; an agentic loop runs on the client",
      "An agentic loop can only run once",
    ],
    correctIndex: 1,
    explanation: "An agentic loop iteration is a full cycle: Claude decides to call a tool, the tool executes, Claude observes the result, then decides whether another step is needed.",
    domain: 1,
  },
  {
    id: "d1-8",
    question: "When building a customer support agent with escalation logic, what pattern should you implement?",
    options: [
      "Always escalate to a human after 3 messages",
      "Monitor confidence signals and topic complexity to determine when to escalate, with clear handoff protocols",
      "Never escalate; the AI should handle everything",
      "Escalate only when the user explicitly asks for a human",
    ],
    correctIndex: 1,
    explanation: "Good escalation logic monitors confidence levels, detects complex scenarios, and has clear protocols for handing off to humans with full context preserved.",
    domain: 1,
  },

  // ───── DOMAIN 2: Tool Design & MCP Integration (19%) ─────
  {
    id: "d2-1",
    question: "What is the correct format for defining a tool's input schema in the Anthropic API?",
    options: [
      "A plain text description of expected parameters",
      "A JSON Schema object with type, properties, and required fields",
      "A TypeScript interface definition",
      "An XML schema document",
    ],
    correctIndex: 1,
    explanation: "Tool input schemas use JSON Schema format with 'type: object', 'properties' defining each parameter, and 'required' listing mandatory fields.",
    domain: 2,
  },
  {
    id: "d2-2",
    question: "What does tool_choice: 'auto' mean in the Anthropic API?",
    options: [
      "Claude must use at least one tool",
      "Claude will automatically pick tools without any instructions",
      "Claude decides whether to use tools or respond directly based on the conversation",
      "A random tool is selected",
    ],
    correctIndex: 2,
    explanation: "tool_choice: 'auto' (the default) lets Claude decide whether to use a tool or respond directly based on the context of the conversation.",
    domain: 2,
  },
  {
    id: "d2-3",
    question: "In MCP, what are the three main primitives a server can expose?",
    options: [
      "Endpoints, schemas, and webhooks",
      "Resources, tools, and prompts",
      "Models, datasets, and pipelines",
      "Functions, events, and streams",
    ],
    correctIndex: 1,
    explanation: "MCP servers expose three primitives: Resources (data/context), Tools (actions the model can invoke), and Prompts (reusable prompt templates).",
    domain: 2,
  },
  {
    id: "d2-4",
    question: "What transport protocols does MCP support?",
    options: [
      "Only HTTP",
      "Only WebSockets",
      "stdio and HTTP with SSE (Server-Sent Events)",
      "gRPC and GraphQL",
    ],
    correctIndex: 2,
    explanation: "MCP supports two transport protocols: stdio (for local process communication) and HTTP with SSE (for remote server connections).",
    domain: 2,
  },
  {
    id: "d2-5",
    question: "When should you set isError: true in a tool result?",
    options: [
      "When any exception occurs in your code",
      "When the tool execution failed and Claude should know the action was not successful",
      "When the response is longer than 1000 characters",
      "Never; errors should be handled silently",
    ],
    correctIndex: 1,
    explanation: "Setting isError: true in tool_result tells Claude the tool execution failed, so it can adjust its approach rather than treating error output as a valid result.",
    domain: 2,
  },
  {
    id: "d2-6",
    question: "What is the purpose of tool specificity in MCP tool design?",
    options: [
      "Making tools as general-purpose as possible",
      "Ensuring each tool has a focused, well-defined purpose with clear input/output schemas",
      "Limiting tools to a single parameter each",
      "Requiring tools to only return strings",
    ],
    correctIndex: 1,
    explanation: "Tool specificity means each tool should have a focused purpose with clear descriptions. Specific tools are more predictable and easier for the model to use correctly.",
    domain: 2,
  },
  {
    id: "d2-7",
    question: "What is the MCP lifecycle flow for a client connecting to a server?",
    options: [
      "Connect → Authenticate → Subscribe → Disconnect",
      "Initialize → Negotiate capabilities → Normal operation → Shutdown",
      "Handshake → Stream → Close",
      "Register → Poll → Timeout",
    ],
    correctIndex: 1,
    explanation: "The MCP lifecycle is: Initialize (exchange protocol versions), negotiate capabilities (declare supported features), normal operation (exchange messages), and shutdown.",
    domain: 2,
  },

  // ───── DOMAIN 3: Claude Code Configuration (19%) ─────
  {
    id: "d3-1",
    question: "What is the purpose of a CLAUDE.md file in a project?",
    options: [
      "It replaces the README.md file",
      "It provides project-specific instructions, conventions, and context that Claude Code uses when working in that codebase",
      "It stores Claude API keys",
      "It configures the build process",
    ],
    correctIndex: 1,
    explanation: "CLAUDE.md provides project-level instructions that Claude Code reads to understand conventions, architecture decisions, and how to work within a specific codebase.",
    domain: 3,
  },
  {
    id: "d3-2",
    question: "What is the CLAUDE.md hierarchy (from broadest to most specific scope)?",
    options: [
      "Project → Directory → User",
      "User (~/.claude/CLAUDE.md) → Project root (CLAUDE.md) → Subdirectory (subdir/CLAUDE.md)",
      "System → Global → Local",
      "There is no hierarchy; only one CLAUDE.md is read",
    ],
    correctIndex: 1,
    explanation: "CLAUDE.md files form a hierarchy: user-level (~/.claude/CLAUDE.md), project root, and subdirectories. More specific files augment broader ones.",
    domain: 3,
  },
  {
    id: "d3-3",
    question: "What are Claude Code hooks used for?",
    options: [
      "Connecting to external APIs",
      "Running custom shell commands in response to events like tool calls, enabling pre/post-processing and automation",
      "Managing git branches",
      "Scheduling recurring tasks",
    ],
    correctIndex: 1,
    explanation: "Hooks let you run shell commands triggered by Claude Code events (PreToolUse, PostToolUse, etc.), enabling custom validation, formatting, or other automation.",
    domain: 3,
  },
  {
    id: "d3-4",
    question: "How do you create custom slash commands in Claude Code?",
    options: [
      "Edit the settings.json file",
      "Place markdown files in .claude/commands/ directory with the command name as the filename",
      "Register them through the Claude API",
      "Custom slash commands are not supported",
    ],
    correctIndex: 1,
    explanation: "Custom slash commands are created by placing .md files in .claude/commands/. The filename becomes the command (e.g., review.md → /review).",
    domain: 3,
  },
  {
    id: "d3-5",
    question: "What is Plan Mode in Claude Code?",
    options: [
      "A mode where Claude Code only generates project plans, never code",
      "A mode where Claude Code thinks through an approach before writing code, ideal for complex tasks",
      "A paid-only feature for enterprise users",
      "A mode that disables all tool use",
    ],
    correctIndex: 1,
    explanation: "Plan Mode lets Claude Code analyze the task and outline an approach before writing any code. It's useful for complex tasks that benefit from upfront planning.",
    domain: 3,
  },
  {
    id: "d3-6",
    question: "In a CI/CD pipeline, how should Claude Code permissions be configured?",
    options: [
      "Give full access to everything",
      "Use the --allowedTools flag to restrict to only necessary tools, and provide clear CLAUDE.md instructions for the CI context",
      "Disable Claude Code in CI entirely",
      "Use the same configuration as local development",
    ],
    correctIndex: 1,
    explanation: "In CI/CD, restrict Claude Code's tools to only what's needed (e.g., read-only), and provide CI-specific CLAUDE.md instructions for the automated context.",
    domain: 3,
  },
  {
    id: "d3-7",
    question: "What file configures MCP servers for Claude Code in a project?",
    options: [
      "mcp-config.json",
      ".claude/mcp.json (project-scoped) or ~/.claude/mcp.json (user-scoped)",
      "package.json under 'mcp' key",
      "settings.yaml",
    ],
    correctIndex: 1,
    explanation: "MCP server configurations go in .claude/mcp.json for project-specific servers or ~/.claude/mcp.json for user-wide servers.",
    domain: 3,
  },

  // ───── DOMAIN 4: Prompt Engineering & Structured Output (20%) ─────
  {
    id: "d4-1",
    question: "What is the recommended approach for getting structured JSON output from Claude?",
    options: [
      "Just ask for JSON in the prompt and hope for the best",
      "Use the system prompt to define the schema, provide examples, and use XML tags to structure the request",
      "Use a separate JSON parsing library",
      "Claude cannot produce structured output",
    ],
    correctIndex: 1,
    explanation: "For reliable structured output, define the expected schema clearly, use XML tags for structure, provide examples, and optionally prefill the assistant response with '{'.",
    domain: 4,
  },
  {
    id: "d4-2",
    question: "What is chain-of-thought prompting?",
    options: [
      "Sending multiple API calls in sequence",
      "Asking Claude to work through its reasoning step-by-step before giving a final answer",
      "Connecting multiple Claude models together",
      "A technique for reducing API costs",
    ],
    correctIndex: 1,
    explanation: "Chain-of-thought prompting asks Claude to show its reasoning process step by step, which improves accuracy on complex tasks by breaking them into smaller logical steps.",
    domain: 4,
  },
  {
    id: "d4-3",
    question: "What is the purpose of few-shot prompting?",
    options: [
      "Limiting the number of API calls",
      "Providing examples of desired input-output pairs so Claude learns the pattern",
      "Using a smaller model for faster responses",
      "Sending prompts with fewer tokens",
    ],
    correctIndex: 1,
    explanation: "Few-shot prompting includes examples of desired behavior (input-output pairs) in the prompt, helping Claude understand the expected format and approach.",
    domain: 4,
  },
  {
    id: "d4-4",
    question: "Why are XML tags recommended for structuring Claude prompts?",
    options: [
      "Claude was trained on XML data exclusively",
      "They provide clear delimiters for different sections, making prompts more parseable and reducing ambiguity",
      "They are required by the API",
      "They reduce token count",
    ],
    correctIndex: 1,
    explanation: "XML tags like <instructions>, <examples>, <context> create clear boundaries between different parts of a prompt, reducing ambiguity and improving output consistency.",
    domain: 4,
  },
  {
    id: "d4-5",
    question: "What is a resilient catch-all in structured data extraction?",
    options: [
      "A fallback API endpoint",
      "A field in the output schema that captures data the model found but couldn't map to existing fields",
      "An error handler that retries failed extractions",
      "A default value applied to all empty fields",
    ],
    correctIndex: 1,
    explanation: "A resilient catch-all is an 'other_info' or 'additional_data' field that captures valuable information that doesn't fit predefined schema fields, preventing data loss.",
    domain: 4,
  },
  {
    id: "d4-6",
    question: "What is the Batch API used for?",
    options: [
      "Sending a single large message",
      "Processing many independent requests at once at a lower cost with 24-hour turnaround",
      "Creating batch database operations",
      "Combining multiple model responses into one",
    ],
    correctIndex: 1,
    explanation: "The Batch API lets you submit many independent requests for asynchronous processing. It costs 50% less and returns results within 24 hours.",
    domain: 4,
  },
  {
    id: "d4-7",
    question: "When prefilling the assistant response, what is the recommended practice?",
    options: [
      "Always prefill with a complete paragraph",
      "Prefill with the opening of the expected format (like '{' for JSON) to guide the output structure",
      "Never prefill; let Claude generate from scratch",
      "Prefill with the entire expected response",
    ],
    correctIndex: 1,
    explanation: "Prefilling with a structural hint (like '{' for JSON or the start of an XML tag) guides Claude to output in the correct format without constraining content.",
    domain: 4,
  },

  // ───── DOMAIN 5: Context Management & Reliability (15%) ─────
  {
    id: "d5-1",
    question: "What is the purpose of context window management in long-running agent sessions?",
    options: [
      "To increase the API rate limit",
      "To keep conversations within token limits while preserving important information through summarization and pruning",
      "To translate between languages",
      "To save money on API calls",
    ],
    correctIndex: 1,
    explanation: "Long sessions accumulate tokens. Context management uses techniques like summarization, pruning tool results, and prioritizing recent context to stay within limits.",
    domain: 5,
  },
  {
    id: "d5-2",
    question: "What is narrative summarization in the context of agent sessions?",
    options: [
      "Writing a story about the conversation",
      "Compressing earlier conversation turns into a concise summary that preserves key decisions, findings, and context",
      "Translating technical content into plain language",
      "Generating a README from the conversation",
    ],
    correctIndex: 1,
    explanation: "Narrative summarization compresses older turns into a summary of key decisions, findings, and unresolved issues, freeing token space while preserving essential context.",
    domain: 5,
  },
  {
    id: "d5-3",
    question: "What is tool context pruning?",
    options: [
      "Removing unused tool definitions from the API call",
      "Reducing the size of tool results in conversation history by summarizing or truncating them",
      "Deleting tool configurations from the project",
      "Limiting the number of tools to five",
    ],
    correctIndex: 1,
    explanation: "Tool context pruning reduces large tool results in conversation history by summarizing or truncating them, freeing token space for more relevant recent context.",
    domain: 5,
  },
  {
    id: "d5-4",
    question: "What are guardrails in the context of AI systems?",
    options: [
      "Physical security barriers in data centers",
      "Safety mechanisms that constrain AI behavior, validate outputs, and prevent harmful or incorrect responses",
      "Rate limiting configurations",
      "Database backup systems",
    ],
    correctIndex: 1,
    explanation: "Guardrails are safety mechanisms that validate inputs/outputs, prevent harmful content, ensure outputs meet quality standards, and keep the AI within intended boundaries.",
    domain: 5,
  },
  {
    id: "d5-5",
    question: "What is provenance tracking in multi-agent research systems?",
    options: [
      "Tracking which Git commit introduced a bug",
      "Recording where each piece of information came from so you can verify sources and attribute claims",
      "Monitoring server uptime",
      "Logging API response times",
    ],
    correctIndex: 1,
    explanation: "Provenance tracking records the source of each piece of information gathered by agents, enabling fact-checking, citation, and reliability assessment.",
    domain: 5,
  },
  {
    id: "d5-6",
    question: "What is the recommended approach for handling errors in an agentic loop?",
    options: [
      "Stop the loop immediately on any error",
      "Silently ignore all errors",
      "Propagate error context to Claude so it can adapt its strategy, with configurable retry logic and escalation thresholds",
      "Log the error and continue without telling Claude",
    ],
    correctIndex: 2,
    explanation: "Errors should be communicated back to Claude via isError tool results so it can adjust. Implement retry logic for transient errors and escalate persistent failures.",
    domain: 5,
  },
  {
    id: "d5-7",
    question: "How does prompt caching benefit long-running applications?",
    options: [
      "It makes the model respond faster by caching the model weights",
      "It caches the processing of repeated prompt prefixes, reducing latency and cost for messages with shared context",
      "It stores user preferences between sessions",
      "It pre-generates common responses",
    ],
    correctIndex: 1,
    explanation: "Prompt caching saves the processing of static prompt prefixes (system prompts, large context). Subsequent requests sharing that prefix get faster, cheaper responses.",
    domain: 5,
  },

  // ───── WEEKLY QUIZZES (supplementary) ─────
  // Week 1: AI Fundamentals
  {
    id: "w1q-1",
    question: "What is the main difference between traditional programming and machine learning?",
    options: [
      "Machine learning is always faster",
      "In traditional programming you write rules explicitly; in ML the system learns patterns from data",
      "Machine learning doesn't use computers",
      "Traditional programming can't handle text data",
    ],
    correctIndex: 1,
    explanation: "Traditional programming: humans write explicit rules. Machine learning: the system learns patterns from data to make predictions or decisions.",
    week: 1,
  },
  {
    id: "w1q-2",
    question: "What does 'AI' stand for and what is its broad goal?",
    options: [
      "Automated Integration - connecting different software systems",
      "Artificial Intelligence - creating systems that can perform tasks normally requiring human intelligence",
      "Advanced Internet - faster networking technology",
      "Algorithmic Indexing - organizing data efficiently",
    ],
    correctIndex: 1,
    explanation: "Artificial Intelligence aims to create systems capable of tasks that typically require human intelligence: understanding language, recognizing patterns, making decisions.",
    week: 1,
  },
  {
    id: "w1q-3",
    question: "What is a Large Language Model (LLM)?",
    options: [
      "A physical device that translates languages",
      "An AI model trained on massive text data that can understand and generate human language",
      "A database containing all known words",
      "A programming language for AI",
    ],
    correctIndex: 1,
    explanation: "LLMs are neural networks trained on vast amounts of text data, learning to predict and generate language. Claude, GPT, and Gemini are examples.",
    week: 1,
  },

  // Week 2: GenAI & API
  {
    id: "w2q-1",
    question: "What does the 'temperature' parameter control in the Claude API?",
    options: [
      "How fast the model processes requests",
      "The randomness/creativity of the model's output",
      "The size of the response",
      "The language of the output",
    ],
    correctIndex: 1,
    explanation: "Temperature controls randomness: lower values (0-0.3) produce more focused, deterministic outputs; higher values (0.7-1.0) produce more creative, varied responses.",
    week: 2,
  },
  {
    id: "w2q-2",
    question: "What is the role of the 'system' prompt in a Claude API call?",
    options: [
      "It sets the operating system for the API",
      "It provides persistent instructions that guide Claude's behavior throughout the conversation",
      "It selects which model to use",
      "It configures billing settings",
    ],
    correctIndex: 1,
    explanation: "The system prompt provides persistent context and instructions that guide Claude's behavior, persona, and constraints throughout the entire conversation.",
    week: 2,
  },
  {
    id: "w2q-3",
    question: "What does 'max_tokens' control in the API?",
    options: [
      "The maximum number of messages in a conversation",
      "The maximum length of Claude's response",
      "The maximum number of API calls per minute",
      "The maximum cost of a single call",
    ],
    correctIndex: 1,
    explanation: "max_tokens sets the upper limit on how many tokens (roughly words/word-pieces) Claude will generate in its response.",
    week: 2,
  },

  // Week 3: Prompt Engineering
  {
    id: "w3q-1",
    question: "What is a system prompt best used for?",
    options: [
      "Storing user credentials",
      "Setting Claude's role, personality, rules, and consistent behavior across the conversation",
      "Defining the API endpoint URL",
      "Selecting the model version",
    ],
    correctIndex: 1,
    explanation: "System prompts establish Claude's persona, rules, constraints, and context that persist throughout the conversation. They're ideal for consistent behavior.",
    week: 3,
  },
  {
    id: "w3q-2",
    question: "What does 'prompt chaining' refer to?",
    options: [
      "Sending the same prompt to multiple models",
      "Breaking a complex task into sequential steps, using the output of one prompt as input for the next",
      "Repeating a prompt until you get the right answer",
      "Linking multiple API keys together",
    ],
    correctIndex: 1,
    explanation: "Prompt chaining decomposes complex tasks into a pipeline of simpler steps, where each step's output feeds into the next, improving reliability and control.",
    week: 3,
  },

  // Week 5: Tool Use
  {
    id: "w5q-1",
    question: "What must every tool definition include in the Claude API?",
    options: [
      "Only a name",
      "A name, description, and input_schema (JSON Schema)",
      "A name and a URL endpoint",
      "A name, API key, and timeout value",
    ],
    correctIndex: 1,
    explanation: "Each tool needs a name (identifier), description (helps Claude understand when/how to use it), and input_schema (JSON Schema defining parameters).",
    week: 5,
    domain: 2,
  },
  {
    id: "w5q-2",
    question: "What is a tool_result message?",
    options: [
      "The API response from Anthropic's servers",
      "The message you send back to Claude containing the output from executing a tool call",
      "An error log from a failed API call",
      "A summary of all tools used in a conversation",
    ],
    correctIndex: 1,
    explanation: "After Claude requests a tool call, you execute the tool and send back a tool_result message with the output, so Claude can continue reasoning with that information.",
    week: 5,
    domain: 2,
  },

  // Week 6: MCP
  {
    id: "w6q-1",
    question: "What problem does MCP (Model Context Protocol) solve?",
    options: [
      "It makes AI models faster",
      "It provides a standardized protocol for connecting AI models to external data sources and tools",
      "It compresses model weights",
      "It encrypts API calls",
    ],
    correctIndex: 1,
    explanation: "MCP standardizes how AI applications connect to external tools and data sources, replacing custom integrations with a universal, open protocol.",
    week: 6,
    domain: 2,
  },
  {
    id: "w6q-2",
    question: "What is the difference between MCP resources and MCP tools?",
    options: [
      "They are the same thing",
      "Resources provide data/context for the model to read; tools are actions the model can execute",
      "Resources are free; tools cost money",
      "Resources are for images; tools are for text",
    ],
    correctIndex: 1,
    explanation: "Resources expose data (files, DB records, API data) for the model to read. Tools are actions the model can invoke to perform operations (query, create, update).",
    week: 6,
    domain: 2,
  },

  // Week 8: Claude Code
  {
    id: "w8q-1",
    question: "What is Claude Code?",
    options: [
      "A code editor made by Anthropic",
      "An agentic coding assistant that runs in your terminal, understands your codebase, and can edit files, run commands, and use tools",
      "A programming language created by Anthropic",
      "A VS Code theme",
    ],
    correctIndex: 1,
    explanation: "Claude Code is a CLI tool that acts as an AI pair programmer - it reads your codebase, edits files, runs terminal commands, and integrates with MCP servers.",
    week: 8,
    domain: 3,
  },
  {
    id: "w8q-2",
    question: "What is the .claude/commands/ directory used for?",
    options: [
      "Storing API keys",
      "Custom slash commands - .md files here become slash commands like /review, /test, etc.",
      "Log files from Claude Code sessions",
      "Backup copies of edited files",
    ],
    correctIndex: 1,
    explanation: "Files in .claude/commands/ become custom slash commands. For example, review.md creates the /review command with the file's content as the prompt.",
    week: 8,
    domain: 3,
  },

  // Week 11: RAG
  {
    id: "w11q-1",
    question: "What does RAG stand for and what is its purpose?",
    options: [
      "Random Access Generation - generating random outputs",
      "Retrieval-Augmented Generation - enhancing AI responses with relevant retrieved context from external documents",
      "Rapid API Gateway - faster API connections",
      "Recursive Agent Graph - complex agent architectures",
    ],
    correctIndex: 1,
    explanation: "RAG retrieves relevant documents/chunks from a knowledge base and includes them in the prompt, giving the model up-to-date, specific context to generate better answers.",
    week: 11,
  },
  {
    id: "w11q-2",
    question: "What is a vector embedding in the context of RAG?",
    options: [
      "A 3D image format",
      "A numerical representation of text that captures semantic meaning, enabling similarity search",
      "A type of database index",
      "A compression algorithm",
    ],
    correctIndex: 1,
    explanation: "Embeddings convert text into numerical vectors where semantically similar texts are close together in vector space, enabling similarity-based retrieval.",
    week: 11,
  },

  // Week 13: Exam Domain 1 Deep Dive
  {
    id: "d1-exam-1",
    question: "A customer support system needs to handle returns, billing, and technical issues. What agent architecture is most appropriate?",
    options: [
      "A single agent with all tools available",
      "A coordinator agent that classifies the request and delegates to specialized subagents for returns, billing, and tech support",
      "Three completely independent chatbots on separate pages",
      "A rule-based decision tree with no AI",
    ],
    correctIndex: 1,
    explanation: "A coordinator-subagent pattern lets a routing agent classify intent and delegate to focused subagents, each with domain-specific tools and knowledge.",
    domain: 1,
    week: 13,
  },
  {
    id: "d1-exam-2",
    question: "When an agent's stop_reason is 'end_turn' but the task isn't complete, what should you check?",
    options: [
      "The API is broken; report a bug",
      "Whether the agent has clear enough instructions, whether tools returned useful results, and whether context limits were reached",
      "Nothing; end_turn means the task is always complete",
      "The user's internet connection",
    ],
    correctIndex: 1,
    explanation: "Premature end_turn often signals unclear instructions, unhelpful tool results, or context exhaustion. Debug by checking prompt clarity, tool output quality, and token usage.",
    domain: 1,
    week: 13,
  },

  // Week 15: Exam Domain 4 Deep Dive
  {
    id: "d4-exam-1",
    question: "You need to extract structured data from 10,000 unstructured documents. What is the recommended approach?",
    options: [
      "Process them all with a single API call",
      "Design a schema with resilient catch-alls, use few-shot examples, implement validation loops, and process via the Batch API",
      "Manually label all 10,000 documents",
      "Use regex patterns only",
    ],
    correctIndex: 1,
    explanation: "For large-scale extraction: design a robust schema (with catch-alls), provide examples, validate output, retry on failures, and use Batch API for cost efficiency.",
    domain: 4,
    week: 15,
  },

  // Week 16: Exam Domain 5 Deep Dive
  {
    id: "d5-exam-1",
    question: "An agent's conversation has grown to 90% of the context window. What should happen?",
    options: [
      "Let it fail when the limit is reached",
      "Summarize earlier turns, prune large tool results, and keep the most recent and critical context",
      "Start a completely new conversation and lose all context",
      "Increase the max_tokens parameter",
    ],
    correctIndex: 1,
    explanation: "Proactive context management: summarize old turns into key points, trim large tool results to essentials, and preserve recent context and critical decisions.",
    domain: 5,
    week: 16,
  },
];

// ============================
// QUIZ DEFINITIONS
// ============================

export const quizzes: QuizDef[] = [
  // Domain quizzes (exam-focused)
  {
    id: "domain-1",
    title: "Domain 1: Agentic Architecture",
    description: "Test your knowledge of agent patterns, orchestration, and the agentic loop",
    domain: 1,
    timeMinutes: 12,
    passingScore: 70,
    questions: ["d1-1", "d1-2", "d1-3", "d1-4", "d1-5", "d1-6", "d1-7", "d1-8", "d1-exam-1", "d1-exam-2"],
  },
  {
    id: "domain-2",
    title: "Domain 2: Tool Design & MCP",
    description: "Test your knowledge of tool schemas, MCP protocol, and integration patterns",
    domain: 2,
    timeMinutes: 10,
    passingScore: 70,
    questions: ["d2-1", "d2-2", "d2-3", "d2-4", "d2-5", "d2-6", "d2-7", "w5q-1", "w5q-2", "w6q-1", "w6q-2"],
  },
  {
    id: "domain-3",
    title: "Domain 3: Claude Code",
    description: "Test your knowledge of Claude Code configuration, hooks, and commands",
    domain: 3,
    timeMinutes: 10,
    passingScore: 70,
    questions: ["d3-1", "d3-2", "d3-3", "d3-4", "d3-5", "d3-6", "d3-7", "w8q-1", "w8q-2"],
  },
  {
    id: "domain-4",
    title: "Domain 4: Prompt Engineering",
    description: "Test your prompt engineering and structured output skills",
    domain: 4,
    timeMinutes: 10,
    passingScore: 70,
    questions: ["d4-1", "d4-2", "d4-3", "d4-4", "d4-5", "d4-6", "d4-7", "d4-exam-1"],
  },
  {
    id: "domain-5",
    title: "Domain 5: Context & Reliability",
    description: "Test your context management, guardrails, and reliability knowledge",
    domain: 5,
    timeMinutes: 10,
    passingScore: 70,
    questions: ["d5-1", "d5-2", "d5-3", "d5-4", "d5-5", "d5-6", "d5-7", "d5-exam-1"],
  },

  // Weekly quizzes
  {
    id: "week-1",
    title: "Week 1: AI Fundamentals",
    description: "The Big Picture - AI basics, LLMs, and machine learning concepts",
    week: 1,
    timeMinutes: 5,
    passingScore: 60,
    questions: ["w1q-1", "w1q-2", "w1q-3"],
  },
  {
    id: "week-2",
    title: "Week 2: GenAI & API Basics",
    description: "Generative AI concepts, Claude API parameters, and first API calls",
    week: 2,
    timeMinutes: 5,
    passingScore: 60,
    questions: ["w2q-1", "w2q-2", "w2q-3"],
  },
  {
    id: "week-3",
    title: "Week 3: Prompt Engineering",
    description: "Prompt techniques, system prompts, and prompt chaining",
    week: 3,
    timeMinutes: 5,
    passingScore: 60,
    questions: ["w3q-1", "w3q-2"],
  },
  {
    id: "week-5",
    title: "Week 5: Tool Use",
    description: "Tool definitions, schemas, and tool results",
    week: 5,
    timeMinutes: 5,
    passingScore: 60,
    questions: ["w5q-1", "w5q-2"],
  },
  {
    id: "week-6",
    title: "Week 6: MCP Fundamentals",
    description: "Model Context Protocol basics, resources, and tools",
    week: 6,
    timeMinutes: 5,
    passingScore: 60,
    questions: ["w6q-1", "w6q-2"],
  },
  {
    id: "week-8",
    title: "Week 8: Claude Code",
    description: "Claude Code configuration, hooks, and custom commands",
    week: 8,
    timeMinutes: 5,
    passingScore: 60,
    questions: ["w8q-1", "w8q-2"],
  },
  {
    id: "week-11",
    title: "Week 11: RAG & Agents",
    description: "Retrieval-Augmented Generation and multi-agent patterns",
    week: 11,
    timeMinutes: 5,
    passingScore: 60,
    questions: ["w11q-1", "w11q-2"],
  },

  // Placeholder quizzes (coming soon — questions will be added as you progress)
  {
    id: "week-4",
    title: "Week 4: Agents Intro",
    description: "AI agents, transformers, and low-code automation",
    week: 4,
    timeMinutes: 5,
    passingScore: 60,
    questions: [],
  },
  {
    id: "week-7",
    title: "Week 7: MCP Advanced",
    description: "MCP security, sampling, and Agent Skills",
    week: 7,
    timeMinutes: 5,
    passingScore: 60,
    questions: [],
  },
  {
    id: "week-9",
    title: "Week 9: Open-Source Models",
    description: "HuggingFace Hub, transformers library, model pipelines",
    week: 9,
    timeMinutes: 5,
    passingScore: 60,
    questions: [],
  },
  {
    id: "week-10",
    title: "Week 10: LangChain",
    description: "Chains, tools, memory, agents, and orchestration",
    week: 10,
    timeMinutes: 5,
    passingScore: 60,
    questions: [],
  },
  {
    id: "week-12",
    title: "Week 12: Phase 2 Capstone",
    description: "30 questions across all Phase 2 topics",
    week: 12,
    timeMinutes: 15,
    passingScore: 60,
    questions: [],
  },
  {
    id: "week-17",
    title: "Week 17: Cross-Domain Scenarios",
    description: "All 5 exam domains mixed across real-world scenarios",
    week: 17,
    timeMinutes: 20,
    passingScore: 70,
    questions: [],
  },
  {
    id: "week-19",
    title: "Week 19: LLMOps",
    description: "LLMOps lifecycle, monitoring, cost tracking",
    week: 19,
    timeMinutes: 5,
    passingScore: 60,
    questions: [],
  },
];

// Helper functions
export function getQuiz(id: string): QuizDef | undefined {
  return quizzes.find((q) => q.id === id);
}

export function getQuestion(id: string): QuizQuestion | undefined {
  return questions.find((q) => q.id === id);
}

export function getQuestionsByQuiz(quizId: string): QuizQuestion[] {
  const quiz = getQuiz(quizId);
  if (!quiz) return [];
  return quiz.questions.map((qId) => getQuestion(qId)).filter(Boolean) as QuizQuestion[];
}

export function getDomainQuizzes(): QuizDef[] {
  return quizzes.filter((q) => q.domain !== undefined);
}

export function getWeeklyQuizzes(): QuizDef[] {
  return quizzes.filter((q) => q.week !== undefined);
}
