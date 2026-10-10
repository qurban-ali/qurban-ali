In my [previous article](/blog/seo-vs-geo-llm-search) I explained how Generative Engine Optimization (GEO) differs from classic SEO. This one is practical: **what to actually change on your website** so that ChatGPT, Gemini, Perplexity and Google's AI features are more likely to use and cite your content.

None of this is a trick. Every step also makes your content better for human readers — which is exactly why it works.

![The GEO checklist: answer first, structure everything, add facts and sources, show expertise, use schema markup, stay crawlable, measure and refresh](/assets/blog/diagram-geo-checklist.jpg)

## 1. Answer first

AI systems extract **passages**, not whole pages. Make every important section quotable on its own:

- Start each section with a **direct one- or two-sentence answer**, then explain.
- Phrase headings the way people ask questions: *"How much does a custom CRM cost?"* rather than *"Pricing Considerations"*.
- Define key terms explicitly: *"RAG (retrieval-augmented generation) is…"*.

> **Before:** "There are many factors to consider when thinking about timelines…"
>
> **After:** "A typical MVP takes 8–12 weeks. The main factors are scope, integrations and team size."

## 2. Structure everything

Structure helps models understand what each part of a page is about:

- One clear **H1**, logical **H2/H3** headings.
- **Numbered steps** for processes, **bullet lists** for options.
- **Comparison tables** for "X vs Y" questions — these are frequently reused in AI answers.
- A short **FAQ section** covering the follow-up questions customers really ask.

## 3. Add facts, data and sources

Generic content is interchangeable; specific content is citable. The original GEO research found that adding **statistics, quotations and citations** made content more likely to appear in generated answers.

- Use concrete numbers, dates and named examples.
- **Link to primary sources** for claims you didn't originate.
- Publish **original data** where you can: benchmarks, survey results, case-study outcomes. Unique facts are the strongest reason for a model to cite *you*.

## 4. Show real expertise

Models — and the search systems feeding them — look for signals that a real, qualified person stands behind the content:

- A visible **author name, role and bio** on every article.
- **First-hand experience:** "When we built X, we found Y."
- **Case studies** with real context, constraints and outcomes.
- Consistent profiles (LinkedIn, GitHub, company page) that connect the author to the topic.

## 5. Use structured data (schema markup)

Schema.org markup in JSON-LD tells machines exactly what a page contains. Start with:

- `Article` / `BlogPosting` — title, author, publish and update dates.
- `Person` and `Organization` — who you are and how to reach you.
- `FAQPage` — for genuine Q&A sections.
- `Product` / `Service` — for offerings and pricing.

Validate it with Google's Rich Results Test.

## 6. Stay crawlable — for the right bots

If a crawler can't read your content, nothing else matters:

- **Server-render important text.** Content that only appears after heavy client-side JavaScript is harder for many crawlers to read.
- Keep pages **fast** and **mobile-friendly**.
- Maintain an up-to-date **XML sitemap**.
- Review `robots.txt` deliberately. AI companies publish their crawler names (for example OpenAI's `GPTBot` and `OAI-SearchBot`, and Google's `Google-Extended` control). Decide which ones you allow based on whether you want visibility in their products.
- Optionally add an **`llms.txt`** file — a proposed convention that gives LLMs a concise, Markdown overview of your site. Support across AI tools is still inconsistent, so treat it as a low-cost extra, not a guarantee.

## 7. Measure and refresh

You can't improve what you don't track:

- **Referral traffic:** in your analytics, watch for visits from `chatgpt.com`, `perplexity.ai`, `gemini.google.com` and similar.
- **Prompt testing:** keep a list of 20–30 questions your customers ask and check monthly which brands and pages AI assistants mention.
- **Freshness:** update key pages regularly and show a visible "last updated" date — AI search favours current information.

## A 30-day starter plan

| Week | Focus |
|---|---|
| 1 | List the top 20 questions customers ask; test them in 3 AI assistants and record who gets cited |
| 2 | Rewrite your 5 most important pages: answer-first sections, clear headings, an FAQ |
| 3 | Add schema markup, fix crawlability issues, review `robots.txt` |
| 4 | Publish one piece with original data or a detailed case study; set up AI referral tracking |

## Common mistakes to avoid

- **Keyword stuffing** — it didn't help in the GEO research and it hurts readability.
- **Hiding content** behind tabs, logins or client-only rendering.
- **Thin AI-generated filler** — models are good at recognising content that adds nothing new.
- **Chasing one tool.** Optimise for clarity and evidence, and you improve across all of them.

---

*Want me to audit your site for AI search visibility, or build GEO-friendly structure into your product? [Let's talk](/#contact).*
