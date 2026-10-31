On **9 October 2026**, the Deno team announced that it is **joining Cloudflare**. For a runtime that many of us use every day — often without noticing, because it sits underneath **Supabase Edge Functions** — that raised an obvious question: *what happens to my backend code?*

Here is what has actually been announced, what it means for Supabase users, and a practical plan to keep your functions portable.

## What was announced

Based on the announcement and the coverage since:

- **The Deno team is moving to Cloudflare.** The engineers behind Deno will work on Cloudflare's platform.
- **Deno Deploy is shutting down** roughly six months after the announcement, around **April 2027**. Paying customers are being offered help moving to **Cloudflare Workers**.
- **The Deno runtime goes into maintenance.** It gets bug-fix and security releases for about a year — until around **October 2027** — and then active development stops. The code stays **open source**, so the community can continue it.
- **JSR, the JavaScript/TypeScript package registry, continues**, with its infrastructure moving to Cloudflare.

In short: the runtime you depend on is not disappearing overnight, but it is no longer a product with a roadmap.

## Why this matters for Supabase Edge Functions

Supabase Edge Functions run TypeScript on the **Deno runtime**. The important detail is *how*: Supabase runs its own open-source **Edge Runtime** (a Rust server that embeds a customised Deno runtime) on its own infrastructure. It does **not** depend on Deno Deploy, so the Deploy shutdown does not switch your functions off.

What does change is the long-term direction. A member of the Supabase team explained on Hacker News that Supabase will keep working with the Deno team to bring critical fixes into the Edge Function runtime during the transition, and that its next-generation product, **Supabase Compute**, is already well advanced and will support **Deno as well as Node.js and Bun**, with a migration path from Edge Functions. That came from a team member's comment rather than a formal launch post, so treat timelines as provisional — but the direction is clear: **Supabase is moving from "Deno only" to "your choice of runtime"**.

## What I'd do now: a practical plan

You don't need to rewrite anything this week. You *do* want your functions to be easy to move in 2027.

**1. Inventory your Deno-specific code.**
Search your `supabase/functions` folder for `Deno.` — typically `Deno.serve`, `Deno.env.get`, `Deno.readFile` — plus `jsr:` and `npm:` import specifiers and any `https://deno.land/...` URL imports. That list is your migration surface.

**2. Prefer web-standard APIs.**
`fetch`, `Request`, `Response`, `URL`, `crypto.subtle`, `TextEncoder` and Web Streams work the same in Deno, Node.js, Bun and Cloudflare Workers. Code written against these moves almost for free.

**3. Isolate the runtime behind a thin adapter.**
Keep the entry point tiny and put business logic in plain TypeScript modules:

```ts
// handler.ts — portable: no Deno APIs
export async function handle(req: Request, env: { DB_URL: string }) {
  const { email } = await req.json();
  // ...business logic...
  return Response.json({ ok: true });
}

// index.ts — the only Deno-specific file
import { handle } from "./handler.ts";
Deno.serve((req) => handle(req, { DB_URL: Deno.env.get("DB_URL")! }));
```

When the day comes, you replace one small file per function.

**4. Use a portable framework for routing.**
Frameworks such as **Hono** run on Deno, Node.js, Bun and Cloudflare Workers with the same code, which makes a future move much smaller.

**5. Pin versions and add tests.**
Pin dependency versions, and add a few integration tests that call each function over HTTP. Tests that only use `fetch` will run unchanged against any runtime — they become your migration safety net.

**6. Watch the official channels.**
Follow Supabase's changelog for Compute, and Deno's announcements for the maintenance schedule. Plan the actual move for the first half of 2027, not during the last week of support.

## The bigger lesson

Every platform is a dependency, and dependencies change owners. The teams that will barely notice this news are the ones that wrote **standards-based code with thin platform adapters and good tests**. That is worth doing for every serverless or edge platform you use — not just Deno.

---

**Sources:** [GIGAZINE on Cloudflare and Deno](https://gigazine.net/gsc_news/en/20261013-cloudflare-deno/) · [Tech Insider: Deno team joins Cloudflare](https://tech-insider.org/deno-team-joins-cloudflare-deploy-shutdown-2026/) · [Supabase Edge Runtime](https://supabase.com/blog/edge-runtime-self-hosted-deno-functions) · [Hacker News discussion: "What happens to Supabase?"](https://news.ycombinator.com/item?id=50027914)

*Planning a migration of serverless or edge functions? [Let's talk](/#contact).*
