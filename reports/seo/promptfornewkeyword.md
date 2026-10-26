TASK: Apply a new batch of keywords (from the CSV file(s) I attach with this prompt) to blockhub.games for on-page and off-page SEO. Use ONLY keywords that are genuinely relevant to a specific page. Change nothing else.

SETTINGS (I may edit these numbers before running)
- MIN_VOLUME = 100
- MAX_VOLUME = 3000
- MAX_PAGES_THIS_RUN = 60

HARD RULES
- Do NOT touch: game prose/descriptions on pages, catalog membership, redirects/_redirects, 410 rules, sitemaps, search-index.json, ad/GameMonetize/AdSense code, styling/layout, quality-gate scripts, or any file not needed for metadata.
- Do NOT run git commit or git push.
- Never delete or overwrite existing history. Anything I ask you to "update" is append-only (see below).

PHASE 1: MAPPING (no code edits yet)
1. Read the attached CSV file(s). Extract keyword and monthly volume. Keep only keywords with MIN_VOLUME <= volume <= MAX_VOLUME. Deduplicate (case-insensitive; treat plural and word-order variants as one keyword).
2. Read the existing reports/seo/keyword-mapping.csv if it exists. Never reassign a keyword family that already belongs to another page, and skip keywords already present on their target page. Append new rows to this file; never replace it.
3. RELEVANCE RULE (most important): map a keyword to a page ONLY if that page's own title, content or hub/category membership genuinely matches the search intent (the game exists in the 400-game catalog, or the hub/category really contains such games). A keyword that names a vehicle, genre, character or mechanic the page does not contain must NOT be mapped there. If no good keyword exists for a page, leave that page unchanged. Mapping fewer pages is fine. Do not force matches.
4. Exclude entirely: competitor/portal names (Poki, Friv, Y8, Crazy Games, Arkadium, Miniclip, etc.), third-party game brands and trademarks (Roblox, Minecraft, Mario, GTA, Free Fire, etc.), keywords that are really the name of a different specific game, casino/betting/adult terms, non-English scripts, mobile app/APK/download/offline intent, and anything on the banned-claims or excluded-vocabulary lists in scripts/check-onpage-keywords.js.
5. CANNIBALIZATION RULES:
   - Each keyword family is the PRIMARY keyword of at most ONE page, across ALL runs.
   - Short, broad phrases (e.g. "car parking games", "zombie games online", "bubble shooter") belong only to the hub or category page. Game pages get long-tail phrases that match their own title or mechanics.
   - Per page: 1 primary and at most 2 secondary keywords, none of them word-order or plural variants of each other.
6. Priority order: hubs and categories first, then game pages that already show impressions in Search Console, then other game pages. Stop at MAX_PAGES_THIS_RUN.
7. Write/append reports/seo/keyword-mapping.csv with columns: keyword, volume, target_url, role (primary/secondary/unmapped), reason, run_date. For every unmapped keyword, give a specific reason. Mark relevant-but-unused keywords as "backlog" so they can be used in a future run.
8. Show me a summary table: page, primary keyword, secondary keywords, and a one-line relevance reason. Then STOP and wait. Do not edit any file other than the CSV report until I reply "approved".

PHASE 2: ON-PAGE EDITS (only after I say "approved")
For every approved page:
a) META KEYWORDS: ADD every keyword mapped to that page (primary, secondary and any extra approved ones) to that page's keywords array/override (data/hubs.js seoKeywords, data/categories.js keywords, gameSeoOverrides/keywords in data/games.js, or app/layout.js for global terms). Only add entries. Never remove, reorder or reword existing ones. Skip duplicates (case-insensitive).
b) TITLE: include the primary keyword once, naturally, at most 60 characters. Keep the existing title template.
c) META DESCRIPTION: include the primary keyword once and, only if it reads naturally, one secondary keyword. 120-155 characters. Keep the existing brand ending style. No hype, no unverifiable claims (ratings, player counts, FPS, "best", prizes, etc.).
d) Do not add a keyword to the title or description if it makes the sentence unnatural. In that case it goes into the keywords array only.
e) Do not edit visible page prose in this run.

OFF-PAGE (documentation only, no code)
Append a new dated section to reports/seo/offpage-plan.md (never replace existing content) containing, for the keywords mapped in this run:
- 5 short original post/caption templates for YouTube Shorts, Pinterest, X, Reddit (genuine participation, follow each subreddit's rules, no spam) and Quora, each linking to the matching hub or game page and using its mapped keyword as natural wording.
- Anchor text suggestions per target URL: mostly brand ("BlockHub", "blockhub.games"), some partial match using the mapped keyword, no exact-match stuffing.
- Reminder list: no paid links, no link exchanges or PBNs, no comment spam, no self-clicking ads, no fake reviews.
Do not post, submit or contact anything. I do that manually.

VERIFY
- Run the production build and the internal link audit: 0 broken links, page count unchanged.
- Run scripts/check-onpage-keywords.js and fix any failures.
- Confirm: no title over 60 chars; no description outside 120-155 chars; no primary keyword family used on more than one page across the entire mapping file; no excluded terms in titles or descriptions.
- Confirm sitemaps, redirects, search-index.json and game prose have no diff.
- Add ONE new entry at the TOP of CHANGELOG.md in the existing timestamped format. Keep ALL previous entries untouched. Do not create a new changelog file.
- Show a final diff summary listing pages changed. Do not commit.