Traditional code is deterministic: the same input gives the same output, and a unit test tells you if it's right. LLM features are different. Outputs vary, "correct" is often a matter of degree, and a small prompt change can quietly break cases that used to work.

That's why serious AI teams rely on **evals** — systematic tests for LLM behaviour. If you ship AI features without them, your users become your test suite.

## What is an eval?

An **eval** is a repeatable test that runs your AI feature against a set of example inputs and **scores the outputs** against what good looks like.

Think of it as a unit test suite for prompts, models and retrieval pipelines. You run it:

- before changing a prompt,
- before switching or upgrading a model,
- before changing retrieval (chunking, embeddings, ranking),
- and regularly on production samples to catch drift.

![LLM evaluation pipeline: test set, generate outputs, score with graders, release gate, checking correctness, grounding, format and safety](/assets/blog/diagram-eval-pipeline.jpg)

## Step 1: Build a test set from reality

Start with **50–200 real examples**, not invented ones:

- Common requests that make up most of your traffic.
- **Edge cases** — empty inputs, very long documents, mixed languages.
- **Known failures** from production or user feedback.
- **Adversarial cases** — attempts to make the model ignore instructions or reveal data.

For each example, record what a good output looks like: an exact answer, the facts it must contain, or a rubric.

When I worked on CV and job-description parsing, the most valuable test cases were the messy ones: two-column layouts, unusual job titles, CVs in mixed languages. Those are exactly where a prompt change breaks things.

## Step 2: Choose the right graders

Use the simplest grader that works:

1. **Code-based checks** — Is it valid JSON? Does it match the schema? Is the extracted date correct? Fast, cheap and reliable. Use them wherever possible.
2. **Reference comparison** — Compare against a known answer, exactly or with similarity measures.
3. **LLM-as-judge** — A model scores the output against a rubric ("Is every claim supported by the provided context? Score 1–5 with a reason."). Powerful for open-ended text, but **validate the judge** against human ratings before trusting it.
4. **Human review** — Essential for calibration and high-stakes outputs. Review a sample regularly.

## Step 3: Measure what matters

Typical dimensions:

- **Correctness** — is the answer right and complete?
- **Grounding** — for RAG, is every claim supported by retrieved sources?
- **Format** — does it follow the required structure?
- **Safety** — no leaked personal data, appropriate refusals, resistance to prompt injection.
- **Cost and latency** — quality that's too slow or expensive isn't shippable.

## Step 4: Make evals a release gate

Evals are only useful if they influence decisions:

- **Version** prompts, model settings and test sets alongside your code.
- **Run evals in CI** for any change to prompts, models or retrieval.
- **Compare against the baseline** — ship only if scores hold or improve.
- **Look at the failures**, not just the average. A higher average can hide a new, serious failure.

## Step 5: Keep learning from production

- Log inputs, outputs and user feedback (with appropriate privacy controls).
- Turn new failures into **new test cases**.
- Sample production traffic regularly for human review.

Over time, your eval set becomes one of the most valuable assets of your AI product — it encodes everything you've learned about what "good" means for your users.

## The bottom line

You wouldn't ship backend code without tests. Don't ship prompts without evals. Start small — 50 real examples and a few code-based checks — and grow from there. It's the difference between hoping your AI feature works and **knowing** it does.

---

*Need help making your AI features reliable and measurable? [Get in touch](/#contact).*
