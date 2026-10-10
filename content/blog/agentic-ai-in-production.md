The first wave of generative AI in products was the chatbot: you ask, it answers. The current wave is **agentic AI** — systems that don't just answer, but **plan and carry out multi-step tasks** using real tools: looking up an order, querying a database, updating a ticket, sending an email.

Every major AI provider now ships agent-building tools, and many teams are being asked to "add an agent". Here's what that actually involves, where agents work well today, and how to put one into production without regretting it.

## What makes something an "agent"?

An AI agent is an LLM that works in a **loop**:

1. **Understand the goal** — "refund order #1042 and let the customer know".
2. **Plan** — break it into steps.
3. **Act** — call a tool (an API, a database query, a search).
4. **Observe** — read the result, decide whether it worked.
5. **Repeat** until the goal is met, or hand over to a human.

The key difference from a chatbot is that the **model decides which tool to call next**, based on what happened in the previous step.

![Diagram of the agent loop: user request, plan, call tools, check results, looping until done, with guardrails for permissions, human approval and limits](/assets/blog/diagram-agent-loop.jpg)

## Where agents work well today

Agents shine on tasks that are **multi-step, repetitive and verifiable**:

- **Customer support triage:** classify the request, pull account data, draft a reply, escalate edge cases.
- **Internal operations:** reconcile records, chase missing information, prepare reports.
- **Recruitment workflows:** parse CVs, match against roles, schedule next steps — work I've built into recruitment platforms.
- **Software engineering:** reproduce a bug, write a fix and tests, open a pull request for review.

They struggle when the goal is vague, success is hard to check, or a single mistake is very expensive.

## Five lessons for production

**1. Start with a workflow, not full autonomy.**
Most successful "agents" are really **structured workflows with LLM decisions at specific points**. A fixed sequence with one or two model-driven branches is easier to test, cheaper to run and more predictable than an open-ended agent. Add autonomy only where it clearly pays off.

**2. Design tools like you design APIs for junior developers.**
The model only knows what your tool names, descriptions and parameters tell it. Use clear names (`get_order_by_id`, not `fetch`), describe when to use each tool, validate every input, and return helpful error messages the model can recover from.

**3. Least privilege, always.**
Give each agent only the tools and data it needs for its task. A support agent that can issue refunds should not also be able to delete accounts. Treat everything the model reads — emails, web pages, documents — as **untrusted input**, because it can contain instructions designed to hijack the agent (*prompt injection*).

**4. Keep a human in the loop for consequential actions.**
Money movement, deletions, and messages to customers should require approval — at least until you have evidence the agent is reliable. A good pattern: the agent prepares everything, a human clicks "approve".

**5. Observe everything.**
Log every step: the prompt, the tool called, the inputs, the outputs, cost and latency. When an agent misbehaves, the trace is the only way to understand why. Set **budgets** for steps and spend so a confused agent can't loop forever.

## How to measure success

Before launch, agree on what "working" means:

- **Task success rate** on a test set of real scenarios.
- **Escalation rate** — how often it hands over to a human, and whether that was correct.
- **Cost and time per completed task** compared to the manual process.
- **Error severity** — a wrong tone is not the same as a wrong refund.

I cover how to build these test sets in a later article on [LLM evals](/blog/llm-evals-testing-ai-features).

## The bottom line

Agentic AI is real and useful — but the winning teams treat it as **software engineering, not magic**: narrow scope, well-designed tools, strict permissions, human approval where it matters, and thorough logging. Start with one painful, repetitive workflow, prove the value, then expand.

---

*Planning an AI agent for your product or operations? [Let's talk it through](/#contact).*
