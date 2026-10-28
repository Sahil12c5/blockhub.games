TASK: Apply a new batch of keywords (from the CSV file(s) attached to this prompt) to blockhub.games for on-page and off-page SEO. Use ONLY keywords that are genuinely relevant to a specific page. Change nothing outside the scope listed below.

SETTINGS (I may edit these before running)
- MIN_VOLUME = 100
- MAX_VOLUME = 3000
- COMPETITION = low only (see the filter in Phase 1, step 1)
- MAX_PAGES_THIS_RUN = 60
- EDIT_VISIBLE_GAME_TEXT = yes (H1, first paragraph and description text may be edited under the rules in Phase 2)

HARD RULES
- Do NOT touch: URLs/slugs, catalog membership, redirects/_redirects, 410 rules, sitemaps, ad/GameMonetize/AdSense code, styling/layout, quality-gate scripts, game embed/iframe code, or any file not needed for metadata and the page text listed below.
- search-index.json: do not hand-edit. If the build regenerates it from titles, report exactly which entries changed and why, and wait for my OK.
- Do NOT run git commit or git push.
- Never delete or overwrite existing history. Reports, changelog and mapping files are append-only.

PHASE 1: MAPPING (no code edits yet)
1. Read the attached CSV file(s). Detect the columns for keyword, monthly volume and competition/difficulty (e.g. "Competition", "Competition (indexed value)", "KD", "Keyword Difficulty"). Keep only keywords where:
   - MIN_VOLUME <= volume <= MAX_VOLUME, and
   - competition is LOW: label "Low", or Google Ads index <= 33, or KD <= 30.
   If the CSV has no competition column, tell me, apply the volume filter only, and mark every row "competition: unverified".
   Deduplicate case-insensitively and treat plural and word-order variants as one keyword family.
2. Read reports/seo/keyword-mapping.csv if it exists. Never reassign a keyword family that already belongs to another page. Skip keywords already present on their target page. Append new rows only.
3. RELEVANCE RULE (most important): map a keyword to a page ONLY if that page's own title, content or hub/category membership genuinely matches the search intent (the game exists in the catalog, or the hub/category really contains such games). A keyword naming a vehicle, genre, character or mechanic the page does not contain must NOT be mapped there. If no good keyword fits a page, leave the page unchanged. Mapping fewer pages is fine.
4. Exclude entirely: competitor/portal names (Poki, Friv, Y8, Crazy Games, Arkadium, Miniclip, etc.), third-party brands and trademarks (Roblox, Minecraft, Mario, GTA, Free Fire, etc.), keywords that are really the name of a different specific game, casino/betting/adult terms, non-English scripts, mobile app/APK/download/offline intent, and anything on the banned-claims or excluded-vocabulary lists in scripts/check-onpage-keywords.js.
5. CANNIBALIZATION RULES:
   - Each keyword family is the PRIMARY keyword of at most ONE page, across ALL runs.
   - Short, broad phrases (e.g. "car parking games", "zombie games online") belong only to the hub or category page. Game pages get long-tail phrases matching their own title or mechanics.
   - Per page: 1 primary and at most 2 secondary keywords, none of them plural or word-order variants of each other.
6. Priority: hubs and categories first, then game pages with Search Console impressions, then other game pages. Stop at MAX_PAGES_THIS_RUN.
7. Append to reports/seo/keyword-mapping.csv with columns: keyword, volume, competition, target_url, role (primary/secondary/unmapped/backlog), reason, run_date. Give a specific reason for every unmapped keyword. Mark relevant-but-unused keywords "backlog".
8. Show me a summary table: page, primary keyword, secondary keywords, one-line relevance reason. Also show a proposed before/after for each page's title tag, meta description, H1 and first paragraph. Then STOP. Edit nothing except the CSV report until I reply "approved".

PHASE 2: EDITS (only after I say "approved")
For every approved page:
a) META KEYWORDS: ADD every keyword mapped to that page to its keywords array/override (data/hubs.js seoKeywords, data/categories.js keywords, gameSeoOverrides/keywords in data/games.js, or app/layout.js for global terms). Add only. Never remove, reorder or reword existing entries. Skip duplicates (case-insensitive).
b) TITLE TAG (<title> / meta title): include the primary keyword once, naturally, max 60 characters. Put the keyword near the front where it reads naturally. Keep the existing title template and brand ending.
c) META DESCRIPTION: include the primary keyword once and, only if natural, one secondary keyword. 120-155 characters. Keep the existing brand ending style. No hype or unverifiable claims (ratings, player counts, FPS, "best", prizes, etc.).
d) H1 TAG (exactly one H1 per page):
   - Include the primary keyword once.
   - On game pages the game's real name must stay exactly as it is. Add the keyword only as a short descriptor after the name (e.g. "Game Name - Car Parking Game"). Never rename a game to a different name.
   - Max 70 characters. The H1 must not be identical to the title tag; give it a slightly different wording.
   - Only if the keyword accurately describes the game. Slug and URL stay unchanged.
   - On hub and category pages, the H1 should be the primary keyword phrase written naturally (e.g. "Car Parking Games").
e) FIRST PARAGRAPH (the first visible text paragraph under the H1):
   - The primary keyword must appear once, within the first 100 words, in natural wording. Do not repeat it more than once in this paragraph.
   - You may add ONE new opening sentence, or lightly extend the first existing sentence. Never delete or change the meaning of existing sentences.
   - A secondary keyword may appear once in the same paragraph only if it reads naturally.
   - Describe only what the game or hub actually contains, checked against the page and the game itself. Do not invent features, levels, modes or controls.
   - No keyword stuffing, no repeated phrases, no hype or banned claims.
f) REST OF DESCRIPTION: do not change it, except that a secondary keyword may be added once as one extra natural sentence (max 30 words) if the first paragraph could not hold it.
g) If a keyword makes any title, heading or sentence unnatural, put it in the keywords array only.
h) Before changing any visible text, log the original and the new text in reports/seo/onpage-text-history.csv (append-only) with columns: page_url, field (title tag / meta description / H1 / first paragraph / other), old_text, new_text, run_date. This makes every change reversible.

OFF-PAGE (documentation only, no code)
Append a new dated section to reports/seo/offpage-plan.md (never replace existing content) for the keywords mapped in this run:
- 5 short original post/caption templates for YouTube Shorts, Pinterest, X, Reddit (genuine participation, follow each subreddit's rules, no spam) and Quora. Each links to the matching hub or game page and uses its mapped keyword as natural wording.
- Anchor text suggestions per target URL: mostly brand ("BlockHub", "blockhub.games"), some partial match using the mapped keyword, no exact-match stuffing.
- Reminder list: no paid links, no link exchanges or PBNs, no comment spam, no self-clicking ads, no fake reviews.
Do not post, submit or contact anything. I do that manually.

VERIFY
- Run the production build and the internal link audit: 0 broken links, page count unchanged.
- Run scripts/check-onpage-keywords.js and fix any failures.
- Confirm for every edited page:
  - title tag is at most 60 chars and contains the primary keyword once
  - meta description is 120-155 chars
  - exactly one H1, at most 70 chars, containing the primary keyword, and different from the title tag
  - the primary keyword appears in the first paragraph within the first 100 words, and not more than once there
  - no excluded terms in any title, heading or description
- Confirm no primary keyword family is used on more than one page across the whole mapping file.
- Confirm sitemaps, redirects, slugs/URLs, ad code and embed code have no diff, and that search-index.json has no diff other than what I approved.
- Confirm no game's real name was changed and every edited paragraph still contains all of its original sentences.
- Add ONE new entry at the TOP of CHANGELOG.md in the existing timestamped format. Keep ALL previous entries untouched. Do not create a new changelog file.
- Show a final diff summary listing pages changed, with the new title tag, H1 and first-paragraph opening for each. Do not commit.