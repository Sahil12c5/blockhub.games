TASK: Apply a new batch of keywords (from the CSV file(s) attached to this prompt) to blockhub.games for on-page and off-page SEO. Use ONLY keywords that are genuinely relevant to a specific page. Change nothing outside the scope listed below.

SETTINGS (I may edit these before running)
- MIN_VOLUME = 100
- MAX_VOLUME = 3000
- COMPETITION = low only (see the filter in Phase 1, step 1)
- MAX_PAGES_THIS_RUN = 60
- EDIT_VISIBLE_GAME_TEXT = yes (H1, first paragraph and description text may be edited under the rules in Phase 2)
- [NEW] MAX_SECONDARY_PER_PAGE = 2 (visible-text secondaries; extra high-overlap variants go to the keywords array only)
- [NEW] MAX_BODY_MENTIONS_PER_KEYWORD = 2 (each clustered keyword may appear at most this many times in the page's visible text, including the first paragraph)

HARD RULES
- Do NOT touch: URLs/slugs, catalog membership, redirects/_redirects, 410 rules, sitemaps, ad/GameMonetize/AdSense code, styling/layout, quality-gate scripts, game embed/iframe code, or any file not needed for metadata and the page text listed below.
- [NEW] Do NOT create new pages, hubs, categories or tags. If a keyword needs its own page or tag that does not exist, mark it "backlog: needs own page/tag" and stop there.
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
5. [NEW] OVERLAP CLUSTERING (do this before assigning pages):
   a) Group the filtered keyword families into clusters by search-intent overlap. Two families are HIGH overlap when a searcher would be satisfied by the same page: they share the same head term and modifier meaning (e.g. "car parking games" / "parking games online" / "free car parking games"), or one is a direct synonym or a minor qualifier of the other (free, online, new, fun, play). They are LOW overlap when they differ in game type, mechanic, vehicle, theme or audience (e.g. "car parking games" vs "truck driving games"), even if they share a word.
   b) HIGH overlap cluster: assign the whole cluster to ONE page. The highest-volume, most natural phrase is the primary. The next strongest (up to MAX_SECONDARY_PER_PAGE) are secondaries. Any remaining members go into the keywords array only. On that page, the cluster is used in the title (primary), meta description (primary plus, if natural, one secondary) and a few natural mentions in the visible text (see Phase 2, steps e and f).
   c) LOW overlap: each keyword (or cluster) gets its OWN page, or the matching existing category/tag page, whichever genuinely matches. Never put two low-overlap clusters on the same page's title, H1 or first paragraph. If no existing page or tag fits a low-overlap cluster, mark it "backlog: needs own page/tag".
   d) In the CSV, record the cluster for every row (see step 8, new column "cluster_id") and the overlap judgement in the reason ("high overlap with X" / "low overlap, separate page").
6. CANNIBALIZATION RULES:
   - Each keyword family is the PRIMARY keyword of at most ONE page, across ALL runs.
   - [CHANGED] A whole high-overlap cluster lives on ONE page; never split it across several pages.
   - Short, broad phrases (e.g. "car parking games", "zombie games online") belong only to the hub or category page. Game pages get long-tail phrases matching their own title or mechanics.
   - [CHANGED] Per page: 1 primary and at most MAX_SECONDARY_PER_PAGE secondary keywords in visible text, none of them plural or word-order variants of each other. Other members of the same high-overlap cluster may be added to the keywords array only.
7. Priority: hubs and categories first, then game pages with Search Console impressions, then other game pages. Stop at MAX_PAGES_THIS_RUN.
8. Append to reports/seo/keyword-mapping.csv with columns: keyword, volume, competition, target_url, role (primary/secondary/keywords-array-only/unmapped/backlog), cluster_id, reason, run_date. [CHANGED: new role value and new cluster_id column; if the existing file lacks cluster_id, add it as a new last-but-one column only for new rows and leave old rows untouched, and tell me.] Give a specific reason for every unmapped keyword. Mark relevant-but-unused keywords "backlog".
9. Show me a summary table: page, cluster_id, primary keyword, secondary keywords, keywords-array-only extras, one-line relevance and overlap reason. Also show a proposed before/after for each page's title tag, meta description, H1 and first paragraph, plus the exact extra sentence(s) planned for the body. Then STOP. Edit nothing except the CSV report until I reply "approved".

PHASE 2: EDITS (only after I say "approved")
For every approved page:
a) META KEYWORDS: ADD every keyword mapped to that page, including keywords-array-only cluster members, to its keywords array/override (data/hubs.js seoKeywords, data/categories.js keywords, gameSeoOverrides/keywords in data/games.js, or app/layout.js for global terms). Add only. Never remove, reorder or reword existing entries. Skip duplicates (case-insensitive).
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
f) [CHANGED] REST OF DESCRIPTION: do not change existing sentences. For a high-overlap cluster you may add up to TWO extra natural sentences (max 30 words each) in the body, so the primary and secondary keywords each get a few natural mentions. Hard cap: no keyword appears more than MAX_BODY_MENTIONS_PER_KEYWORD times in the page's visible text, and no sentence repeats another's phrasing. Cluster members that are keywords-array-only do not appear in visible text.
g) If a keyword makes any title, heading or sentence unnatural, put it in the keywords array only.
h) Before changing any visible text, log the original and the new text in reports/seo/onpage-text-history.csv (append-only) with columns: page_url, field (title tag / meta description / H1 / first paragraph / other), old_text, new_text, run_date. This makes every change reversible.

OFF-PAGE (documentation only, no code)
Append a new dated section to reports/seo/offpage-plan.md (never replace existing content) for the keywords mapped in this run:
- 5 short original post/caption templates for YouTube Shorts, Pinterest, X, Reddit (genuine participation, follow each subreddit's rules, no spam) and Quora. Each links to the matching hub or game page and uses its mapped keyword as natural wording.
- [NEW] Build templates and anchors per cluster: high-overlap keywords in a cluster all point to that cluster's ONE target URL (vary the wording across posts); low-overlap keywords point to their own separate URLs. Never point two low-overlap clusters at the same URL with keyword anchors.
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
  - [NEW] no keyword appears more than MAX_BODY_MENTIONS_PER_KEYWORD times in the page's visible text
  - no excluded terms in any title, heading or description
- Confirm no primary keyword family is used on more than one page across the whole mapping file.
- [NEW] Confirm every high-overlap cluster sits on exactly one page, and no two low-overlap clusters share the same page's title, H1 or first paragraph.
- Confirm sitemaps, redirects, slugs/URLs, ad code and embed code have no diff, and that search-index.json has no diff other than what I approved.
- Confirm no game's real name was changed and every edited paragraph still contains all of its original sentences.
- Add ONE new entry at the TOP of CHANGELOG.md in the existing timestamped format. Keep ALL previous entries untouched. Do not create a new changelog file.
- Show a final diff summary listing pages changed, with the new title tag, H1 and first-paragraph opening for each. Do not commit.