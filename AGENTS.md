<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Operational & Workflow Rules

### 1. Direct Deployment on `main`
- When the user asks to commit and push changes, **commit and push directly to `main`** so Cloudflare Pages automatically deploys the live production build.
- Do not create intermediate feature branches unless specifically requested by the user.

### 2. Explicit Approval Before Committing or Pushing
- **NEVER execute `git commit` or `git push` without explicit human confirmation in the conversation.**
- Present all proposed diffs and verification summaries first. Do not assume consent or skip review.

### 3. Strict Stop After Each Batch
- For any phased, iterative, or batched work (such as page generation, prose rewrites, content audits, or URL migrations), **the agent MUST stop completely after each individual batch**.
- Output the batch artifact/samples for human inspection.
- Wait for the user to review and explicitly approve before proceeding to the next batch. Skipping stops or grouping unapproved batches is strictly forbidden.

### 4. Factual Grounding & SEO Integrity
- All game editorial text must strictly reflect verified feed facts (feed description, feed how-to-play, controls). No invented mechanics, no cross-genre hallucinations.
- Keywords and search trends queries must never be unnaturally stuffed into visible user-facing text.

