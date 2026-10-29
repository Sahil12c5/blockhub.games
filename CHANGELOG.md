# Changelog

All notable changes to the BlockHub.games platform are documented in this file.

## [Verified On-Page & Off-Page Keyword Batch Optimization] - 2026-10-29

### Added
- **On-Page SEO Optimization (16 Pages)**: Applied targeted, factual keywords across Homepage (`/`), Action category (`/category/action`), and 14 catalog games (`referee-simulator-3d`, `need-for-drift`, `knightbit-far-lands`, `storm-dash`, `ashen-watch`, `fragbyte`, `godzilla-runner-game`, `embercraft`, `car-obby-3d`, `curve-free-kick`, `9-ball-pool-3d`, `the-zombie-house`, `slingshot-shooting-game`, `blocky-zombie-shooting`).
- **Custom H1 Support on Game Pages**: Implemented dynamic `{game.h1 || ...}` resolution in `app/game/[slug]/page.js`, ensuring unique H1 tags containing primary keywords distinct from title tags.
- **On-Page History Tracking**: Initialized `reports/seo/onpage-text-history.csv` logging complete before/after text across title tags, meta descriptions, H1 headings, and opening paragraphs for full auditability.
- **Off-Page Outreach Strategy**: Appended Section 9 to `reports/seo/offpage-plan.md` with 5 platform-tailored post templates, diversified anchor text guidelines (60–70% brand), and compliance safeguards.

### Changed
- **Metadata Title & Description Standards**: All updated titles verified at <= 60 characters with site brand suffix; all meta descriptions verified within 120–155 characters without superlatives or ungrounded claims.
- **First Paragraph Grounding**: Ensured primary keyword integration within the first 100 words of each target page's opening paragraph without altering pre-existing factual sentences.

### Verified
- **Quality Gates**: `scripts/check-onpage-keywords.js` passed 100% with 0 violations across excluded terms and banned claims.
- **Zero Cannibalization**: Primary keywords mapped to strictly one unique URL across the entire catalog history.

# Changelog

All notable changes to the BlockHub.games platform are documented in this file.

## [Surfer Keyword Batch Audit & Metatags Expansion] - 2026-10-27

### Added
- **Metatags Keyword Arrays Expansion**: Appended 444 clean, verified search keywords (monthly search volume 100–3,000) across `app/layout.js` (global browser gaming terms), `data/categories.js` (`racing`, `shooting`, `multiplayer`), `data/hubs.js` (`car-parking`, `zombie`, `bubble-shooter`, `obby`, `2-player`), and `data/games.js` (`gameSeoOverrides`), maintaining 100% case-insensitive deduplication and zero corruption of existing metadata.
- **Off-Page Keyword Promotion & Outreach Plan**: Appended Section 8 to `reports/seo/offpage-plan.md` featuring 5 platform-tailored post/caption templates (YouTube Shorts, Pinterest, X/Twitter, Reddit r/WebGames, and Quora), anchor text suggestions (branded, partial match, natural URL), and zero-tolerance risk prevention reminders.
- **Batch Keyword Audit Verification**: Verified complete mapping of 697 keywords, confirming 42 primary/secondary keywords mapped across 29 priority pages with 0 cannibalization, all within 100–3,000 monthly search volume.

### Verified
- **Quality Gates**: `scripts/check-onpage-keywords.js` passed 100% with 0 violations.
- **Production Build & Route Parity**: Passed `npm run build` with 426 static pages generated; internal link audit reports 0 broken links and page count unchanged.

## [Keyword Surfer Metadata & Family-Aligned Optimization] - 2026-10-26

### Added
- **Surfer Keyword Mapping Report**: Created `reports/seo/keyword-mapping.csv` mapping 42 search keywords across 29 approved pages (5 hubs, 3 categories, 21 long-tail catalog games) with monthly search volume between 100 and 3,000, zero keyword family cannibalization, and strict title/mechanics intent matching.
- **Targeted Keywords Array Expansions**: Appended non-duplicate verified keywords to `data/hubs.js` (`seoKeywords`), `data/categories.js` (`keywords`), and `data/games.js` (`gameSeoOverrides.keywords`).

### Changed
- **Hub & Category Titles & Meta Descriptions (8 pages)**: Updated `<title>` (<= 60 chars) and meta descriptions (120–155 chars) across 5 topic hubs (`car-parking`, `zombie`, `bubble-shooter`, `2-player`, `obby`) and 3 categories (`racing`, `shooting`, `multiplayer`) with natural primary keyword integration and site brand endings.
- **Long-Tail Game Titles & Meta Descriptions (21 games)**: Updated `<title>` (<= 60 chars) and meta descriptions (140–149 chars) in `data/games.js` (`gameSeoOverrides`) for 21 catalog games strictly matching verified gameplay mechanics and titles with 0 superlatives and 0 unverifiable claims.

### Verification & Metrics
- **Production Build**: Passed with 426 static pages generated in 8.6s.
- **Internal Link Audit**: 0 broken links across 423 routes; page count unchanged.
- **Quality Gates**: `scripts/check-onpage-keywords.js` passed 100%.
- **Title Lengths**: 100% of titles across all 426 pages are <= 60 characters.
- **Primary Keyword Uniqueness**: 29 unique primary keywords, 0 cross-page duplicates.

## [Targeted SEO & Brand Optimization] - 2026-10-26

### Added
- **Targeted Category & Hub Keywords**: Appended high-intent keywords to `data/categories.js` (`racing`, `shooting`, `multiplayer`) and `data/hubs.js` (`obby`, `car-parking`, `zombie`, `bubble-shooter`), wired through `generateMetadata` in `app/tag/[tag]/page.js` and `app/category/[name]/page.js` to render `<meta name="keywords">`.
- **Visible Intro Paragraphs with Internal Links**: Added 7 unique, factual visible introductory paragraphs (40–70 words each) in `data/hubs.js` and `data/categories.js` linking directly to 3 top playable games per hub/category using Next.js `<Link>`.
- **Targeted Game Keywords Override**: Added `gameSeoOverrides` mapping in `data/games.js` for 8 catalog games (`referee-simulator-3d`, `slingshot-shooting-game`, `cake-sort`, `9-ball-pool-3d`, `godzilla-runner-game`, `embercraft`, `blade-merge`, `collect-brainrot-arena`) and 3 CTR targets (`knightbit-far-lands`, `storm-dash`, `the-zombie-house`), exposing `keywords` in `app/game/[slug]/page.js`.
- **Global Layout Keywords**: Appended 14 non-duplicate broad search keywords to `metadata.keywords` in `app/layout.js`.
- **Off-Page SEO & Brand Strategy Plan**: Created `reports/seo/offpage-plan.md` covering brand consistency, Bing/IndexNow verification, platform rosters (YouTube, Pinterest, X, Reddit, Quora), 10 copy templates, anchor distribution, risk policies, and outreach tracking.

### Changed
- **Hub & Category Titles & Meta Descriptions**: Rewrote `<title>` (<= 60 chars) and meta descriptions (<= 155 chars) for target hubs and categories to naturally integrate primary keywords without hype or unverifiable claims.
- **Game Titles & Meta Descriptions**: Adjusted meta titles and descriptions for 8 targeted games and 3 CTR targets in `data/games.js` to naturally feature primary keywords.
- **Brand Schema alternateNames**: Added `alternateName` array `["Block Hub", "BlockHub Games"]` to `WebsiteJsonLd` and `OrganizationJsonLd` in `components/JsonLd.js`.

## [Unreleased] - 2026-10-26

### Added
- **Homepage Visible Keyword Intro**: Added 1 hand-crafted introductory paragraph (59 words) directly above the game explorer featuring broad keywords (`free online games`, `browser games`, `no download`).
- **Hub Pages Visible Keyword Intros (9 pages)**: Added 9 unique hand-crafted introductory paragraphs (67–73 words each) above the game grid across all 9 topic hubs (`/tag/*`), stating exact game counts and incorporating 2–3 specific SEO keywords naturally.
- **Category Pages Visible Keyword Intros (8 pages)**: Added 8 unique hand-crafted introductory paragraphs (66–72 words each) above the game grid across all 8 categories (`/category/*`), stating exact game counts and incorporating 2–3 category keywords naturally.
- **60% Threshold Related Games Headings (400 pages)**: Updated the related-games heading across all 400 game pages: 151 pages meet the >= 60% related match threshold and use factual keyword headings (e.g., `More free car games online`, `More free truck driving games online`, `More free stickman games online`, `More free soccer games online`), while 249 pages use the category fallback `More {Category} games`.
- **Enforced Banned-Claims & Keyword Audit Script**: Updated `scripts/check-onpage-keywords.js` to enforce zero occurrences of banned claims (`leaderboard`, `achievement`, `boss`, `multi-level`, `diesel`, `tuning`, `zero lag`, `co-op`, `family-friendly`, `account`, `tournament`) in addition to competitor names, excluded vocabulary, sentence uniqueness, and page modification tracking.
- **Detailed Diff Report**: Generated `reports/onpage-keywords-diff.csv` tracking element-level before/after changes across 444 diff entries.

### Changed
- **Hub Meta Descriptions (9 pages)**: Rewrote meta descriptions for all 9 topic hubs within the strict 120–160 character boundary, embedding primary keywords, removing banned claims, and eliminating excluded terms.
- **Category Meta Descriptions (8 pages)**: Rewrote meta descriptions for all 8 categories within the 120–160 character boundary, embedding primary category keywords and removing legacy references to excluded terms.
- **Game Meta Descriptions (400 pages)**: Evaluated all 400 game meta descriptions. Exactly 9 meta descriptions fit naturally with their best-fit hub keyword while strictly preserving the brand ending `on BlockHub.games` within 120–160 characters. The remaining 391 meta descriptions were left unchanged in their original form.
- **2-Player Hub Text**: Rewritten to avoid "5 2 player games free", reading naturally as "five 2 player games" with verified factual gameplay grounding for all 5 games.

### Verification & Metrics
- **Pages Changed**: 418 (1 Homepage + 9 Hub Pages + 8 Category Pages + 400 Game Pages)
- **Diff Entries**: 444 entries in `/reports/onpage-keywords-diff.csv`
- **Pages with > 3 Keyword Phrases Added**: 0 (Max 3 keywords per page strictly observed)
- **Excluded Words in Visible Text**: 0
- **Banned Claims in Added Text**: 0
- **Added Sentences Appearing on > 2 Pages**: 0 (All 63 sentences in added intro paragraphs are 100% unique across the entire site)
- **Game Meta Descriptions Changed**: 9 changed / 391 left alone
- **Max 6-Word Meta Ending Frequency**: 1.3% (5 out of 400, well below the 25% threshold)
- **Related Heading Breakdown**: 151 keyword headings (>= 60% related match), 249 category fallback headings (< 60% related match)
