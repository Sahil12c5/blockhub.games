# Changelog

All notable changes to the BlockHub.games platform are documented in this file.

## [Meta Description SERP Pixel Width Optimization (<985px)] - 2026-10-31

### Changed
- **SERP Pixel Width Optimization Across 37 Pages (<985px)**:
  - Shortened meta descriptions exceeding 985px in Screaming Frog to 129–142 characters (estimated width 839px–923px), preventing Google truncation.
  - Replaced wide vocabulary (*Conquer, Fortify, Weave, Command, Intercept, Neutralize, Simulator, Championship*) with concise synonyms.
  - Retained 100% of mapped keywords from `reports/seo/keyword-mapping.csv` verbatim (*e.g., `highway car game`, `3d zombie game`, `zombie house game`, `stickman puzzle games`, `blockhub games`, `free online games hub`*).
  - Maintained complete sentence endings and `BlockHub.games` brand formatting across all 37 updated routes:
    - **High Priority (21 pages)**: `/game/scrap-arms-neo`, `/game/zombie-highway-car-game`, `/game/last-garage-zombie-road`, `/game/dead-rails`, `/game/spellbound-orbs`, `/game/stickman-legion`, `/game/impossible-jeep-driver`, `/game/hollow-pass`, `/game/the-zombie-house`, `/tag/halloween`, `/game/stickboy-hook`, `/game/grave-blast`, `/game/spooky-racing`, `/game/halloween-football-championship`, `/game/witchy`, `/game/tactical-response-team`, `/game/police-chase-car-simulator`, `/game/pirate-dodge`, `/game/shooter-zombie-survival`, `/game/blaze-ball-showdown`, `/category/adventure`.
    - **Medium Priority (16 pages)**: `/game/american-truck-racing-simulator`, `/game/rich-mom-family-simulator-luxury-life`, `/game/1-speed-superhero-obby`, `/game/scary-granny-horror-maze-escape`, `/game/extreme-monster-truck`, `/tag/truck-driving`, `/game/zombie-drift-steel-rage`, `/game/monster-truck-offroad-2`, `/game/draw-line-stickman`, `/game/extreme-motorcycle-simulator`, `/game/ultimate-car-parking-sim`, `/game/prado-parking-game`, `/` (homepage), `/game/stickman-army-pusher`, `/game/us-coach-bus-simulator-game`, `/game/gun-mob-stickman-run`.

### Verified
- **Quality Gates**: Passed `node scripts/check-mapped-keywords.js` (0 violations) and `node scripts/check-onpage-keywords.js` (0 violations).
- **Production Build**: 426/426 static routes prerendered with exit code 0 via `npm run build`.

## [SEO Targeted Meta Optimizations & Description Rewrites] - 2026-10-31

### Added
- **Permanent Keyword Compliance Quality Gate (`scripts/check-mapped-keywords.js`)**:
  - Validates that every mapped keyword from `reports/seo/keyword-mapping.csv` appears verbatim on its target page.
  - Enforces 0 keyword regressions across all production builds and content updates.

### Changed
- **Targeted SEO Meta & Keyword Enhancements (5 Routes)**:
  - `skyblock-3d` (`/game/skyblock-3d`): Corrected `meta_title` to feature primary keyword `"skyblock game"` (`Skyblock 3D - Skyblock Game | BlockHub.games`, 45 chars).
  - `the-zombie-house` (`/game/the-zombie-house`): Updated `meta_title` to integrate primary keyword `"3d zombie game"` while retaining `"zombie house game"` (`Zombie House Game - 3D Zombie Game | BlockHub`, 46 chars).
  - `racing` category (`/category/racing`): Enriched `metaDescription` with mapped keyword `"car racing games online"` (2,900 vol) while preserving `"cool car games unblocked"` and `"unblocked racing games"` (143 chars).
  - `2-player` topic hub (`/tag/2-player`): Updated `metaTitle` to `"Multiplayer Browser Games - 2 Player Games | BlockHub"` (52 chars) and `headline` to prominently feature primary head term `"multiplayer browser games"`.
  - `shooting` category (`/category/shooting`): Integrated mapped keyword `"shooting game online"` (1,300 vol) into `metaDescription` (146 chars), preserving primary `"gun games for free"` (2,400 vol).
- **SEO Description Rewrites (Batches 3–8 Complete)**:
  - Rewrote 144 game descriptions and meta descriptions across `data/top-games-content.js`, `data/top-games-content.json`, and `data/games.js`.
  - Replaced repetitive boilerplate phrases with unique, factually grounded mechanics (controls, objectives, obstacles, and upgrades).
  - Maintained 0 duplicate 6-grams across all 400 catalog games.
  - Kept all meta descriptions within 120–155 characters ending in complete sentences.
- **Mobile UI & Responsive Design Audit**:
  - Optimized responsive styling across mobile viewports (360px–768px) for `Header`, `HeroFeatured`, `GameCard`, `CategoryGameExplorer`, and `GamePlayer` without altering desktop layouts or DOM heading hierarchies.
- **Search Engine Discovery & Link Architecture**:
  - Strengthened internal linking to resolve indexing delays for the 67 "Discovered, not indexed" pages.
  - Cleaned up removed game URL handling in `public/_redirects` to return real 404s/410s while eliminating internal links to inactive slugs.

### Verified
- **Keyword Compliance**: Passed `node scripts/check-mapped-keywords.js` (0 violations across all 21 mapped targets).
- **On-Page Integrity**: Passed `node scripts/check-onpage-keywords.js` (0 banned claims, 0 mid-sentence truncations, 0 keyword stuffing).
- **Production Build**: Successfully compiled 426/426 static routes with 0 errors via `npm run build`.

## [Screaming Frog Technical SEO Audit & Compliance Fixes] - 2026-10-31

### Fixed
- **Directives & Indexing**:
  - Removed `is2Player` noindex block in `app/tag/[tag]/page.js`, restoring full indexability (`index: true, follow: true`) to the `/tag/2-player` topic hub.
- **Canonical Tags (Missing Canonicals Fixed)**:
  - Added self-referencing absolute canonical tags (`https://blockhub.games/...`) across all 5 static utility pages: `/about` (`app/about/page.js`), `/contact` (`app/contact/layout.js`), `/dmca` (`app/dmca/page.js`), `/privacy-policy` (`app/privacy-policy/page.js`), and `/terms` (`app/terms/page.js`).
- **Heading Hierarchy & DOM Sequencing**:
  - Homepage (`/`): Converted `HeroFeatured` carousel title from `<h2>` to `<p>` with identical typography classes, ensuring the page's primary `<h1>BlockHub Games - Free Online Games Hub</h1>` is the first heading in the DOM (`H1: Non-Sequential` fixed).
  - Contact Page (`/contact`): Added descriptive `<h2>` section dividers (`<h2>Support & Developer Contacts</h2>` and `<h2>Send Us a Direct Message</h2>`) to eliminate the `<h1>` → `<h3>` skip (`H2: Missing` fixed).
- **Thin Content & Word Count**:
  - Contact Page (`/contact`): Added 128 words of editorial developer submission guidelines, bug report troubleshooting specifications, and response time commitments, increasing main content from 114 to 242 words (`Low Content Pages` fixed).
- **SERP Page Title Optimization**:
  - Extended 4 category titles previously under 30 characters with brand suffix:
    - `/category/adventure`: `Free Adventure Games Online | BlockHub.games` (44 chars).
    - `/category/arcade`: `Free Arcade Games Online | BlockHub.games` (41 chars).
    - `/category/puzzle`: `Free Puzzle Games Online | BlockHub.games` (41 chars).
    - `/category/sports`: `Free Sports Games Online | BlockHub.games` (41 chars).
  - Differentiated 3 topic hub titles identical to H1 by adding `| BlockHub`:
    - `/tag/truck-driving`: `Truck Driving Games - Play Free Online | BlockHub` (50 chars).
    - `/tag/football-soccer`: `Football & Soccer Games - Play Free Online | BlockHub` (52 chars).
    - `/tag/halloween`: `Halloween Games - Play Free Online | BlockHub` (44 chars).
  - Shortened 3 titles over 60 characters / 561px while preserving 100% of target keywords:
    - `/category/racing`: `Cool Car Games Unblocked - Play Unblocked Racing Games` (54 chars; restored `Play`, kept `cool car games unblocked`, `unblocked racing games`).
    - `/tag/obby`: `Online Obby Games & Obby Unblocked - Free Sky Parkour` (53 chars; restored `Free`, kept `online obby games`, `obby unblocked`).
    - `/tag/zombie`: `Play Free Zombie Games - Shooting Games Zombies Unblocked` (57 chars; restored `Play`, `Free`, and `shooting games zombies unblocked`).
    - `/dmca`: `DMCA Copyright Notice & Takedown | BlockHub.games` (48 chars).
- **Meta Description Optimization (<155 Characters)**:
  - Shortened 3 category/hub meta descriptions:
    - `/category/racing`: Trimmed filler to 151 characters; restored `open world` phrase, preserved all keywords and CTA.
    - `/tag/obby`: Trimmed filler to 142 characters; restored `fast-paced` descriptor, preserved all keywords and CTA.
    - `/tag/zombie`: Trimmed filler to 133 characters; restored `shooting games zombies unblocked` and `Experience`, preserved all keywords and CTA.
  - Trimmed trailing incomplete sentence fragments from 15 game meta descriptions in `data/top-games-content.js` (`warrior-clash`, `gorbo-the-orc-crown-quest`, `noob-save-the-village`, `midnight-taxi-hustle`, `holdem-royale`, `geometry-vibes-3d`, `pixel-jam-bus-puzzle`, `halloween-dentist-for-kids-2`, `limo-city-taxi-driver`, `witchy`, `octobeer`, `football-pinball`, `extreme-quad-bike-racing`, `chubby-duck-jump`, `last-call-drunken-boxer`).
- **Internal Links & 4xx Verification**:
  - Crawled and audited all 424 static HTML files, 1,255 distinct internal links, search index entries, and sitemaps. Verified 0 broken internal links between site pages (the 1x 4xx in the crawl report was Screaming Frog's automated soft-404 test probe).

### Verified
- **Keyword Integrity**: 0 target keywords changed, removed, or reordered across all 42 active mapped targets.
- **Automated Quality Gate**: Passed `scripts/check-onpage-keywords.js` with 0 violations across 418 audited pages.
- **Production Build**: Successfully compiled 426/426 static routes with 0 errors via `npm run build`.

## [Skyblock 3D & Stickman Puzzle Optimization] - 2026-10-31

### Added
- **On-Page SEO Optimization (2 Game Pages)**:
  - `skyblock-3d` (`CL-SKYBLOCK-01`): Primary `skyblock game`, secondaries `sky block`, `how to play skyblock`, and keywords-array extra `sky block game`.
  - `draw-line-stickman` (`CL-STICKPUZ-01`): Primary `stickman puzzle games`.
- **Category & Hub Keywords Accretion**:
  - `data/categories.js` (`adventure`): Appended `skyblock game`, `sky block`.
  - `data/hubs.js` (`stickman`): Appended `stickman puzzle games` to `seoKeywords`.
  - `app/layout.js`: Appended `skyblock game`, `stickman puzzle games` to site-wide metadata keywords.
- **Search Intent Overlap Clustering**: Clustered 10 incoming queries into 2 dedicated game clusters; routed 6 download and multiplayer/bedrock platform mismatches to unmapped.
- **On-Page Text History Tracking**: Logged complete before/after text records across title tags, meta descriptions, H1 headings, and opening paragraphs to `reports/seo/onpage-text-history.csv`.
- **Off-Page Outreach Strategy**: Appended Section 12 to `reports/seo/offpage-plan.md` featuring 5 platform-tailored post templates, diversified anchor text guidelines (60–70% brand), and compliance safeguards.

### Changed
- **Keyword Density & Mention Constraints**: Enforced `MAX_BODY_MENTIONS_PER_KEYWORD = 2` and `MAX_SECONDARY_PER_PAGE = 2` across all target pages.
- **Metadata Character Counts**: Titles strictly formatted within 47–53 characters (<=60); meta descriptions within 147–154 characters (120–155); H1 headings within 33–42 characters (<=70); first paragraphs within 70–73 words (<=100).

### Verified
- **Automated Quality Gate**: Passed `scripts/check-onpage-keywords.js` with 0 violations across 418 audited pages (0 excluded words, 0 banned claims, 0 mid-sentence truncations).

## [Traffic Racer, Highway Car & Sniper Optimization] - 2026-10-30

### Added
- **On-Page SEO Optimization (3 Game Pages)**:
  - `highway-traffic-racer-3d` (`CL-TRAFFIC-01`): Primary `traffic racer 3d`, secondaries `highway traffic game 3d`, `highway traffic game online`, and keywords-array extras (`highway traffic game`, `highway traffic game free`).
  - `zombie-highway-car-game` (`CL-HWYCAR-01`): Primary `highway car game`.
  - `sniper-shooter-3d` (`CL-SNIPER-01`): Primary `sniper game online`, secondary `sniper shooting games`, and keywords-array extras (`online sniper game`, `best sniper game`, `best sniper games`).
- **Category Keyword Accretion**:
  - `data/categories.js` (`shooting`): Appended `sniper shooting games`, `sniper game online`.
  - `data/categories.js` (`racing`): Appended `traffic racer 3d`, `highway traffic game`.
- **Search Intent Overlap Clustering**: Mapped 24 incoming queries into 3 targeted intent clusters; routed 16 non-matching, mobile, platform-mismatched, and excluded queries to unmapped/backlog.
- **On-Page Text History Tracking**: Logged complete before/after text records across title tags, meta descriptions, H1 headings, and opening paragraphs to `reports/seo/onpage-text-history.csv`.
- **Off-Page Outreach Strategy**: Appended Section 11 to `reports/seo/offpage-plan.md` featuring 5 platform-tailored post templates, diversified anchor text guidelines (60–70% brand), and compliance safeguards.

### Changed
- **Keyword Density & Mention Constraints**: Enforced `MAX_BODY_MENTIONS_PER_KEYWORD = 2` and `MAX_SECONDARY_PER_PAGE = 2` across all target pages.
- **Metadata Character Counts**: Titles strictly formatted within 49–51 characters (<=60); meta descriptions within 147–154 characters (120–155); H1 headings within 41–47 characters (<=70); first paragraphs within 65–71 words (<=100).

### Verified
- **Automated Quality Gate**: Passed `scripts/check-onpage-keywords.js` with 0 violations across 418 audited pages (0 excluded words, 0 banned claims, 0 mid-sentence truncations).

## [Low-Difficulty Keyword Batch Optimization & Overlap Clustering] - 2026-10-29

### Added
- **On-Page SEO Optimization (5 Game Pages)**: Implemented overlap clustering and mapped low-difficulty keywords to 5 dedicated game pages:
  - `ragdoll-survivor` (`CL-RAGDOLL-01`): Primary `ragdoll game online`, secondaries `ragdoll game`, `free ragdoll games`, and keywords-array extras (`ultimate ragdoll game`, `ragdoll games`, `ragdoll games free`).
  - `obby-rainbow-parkour-two-player` (`CL-OBBY-01`): Primary `rainbow obby game`.
  - `real-car-parking-game` (`CL-PARK-01`): Primary `real car parking 3d`, secondaries `parallel parking game`, `car parking 3d`.
  - `city-bus-parking` (`CL-BUS-01`): Primary `bus parking games online`.
  - `oil-tanker-truck-parking-game` (`CL-TRUCK-01`): Primary `truck parking games`.
- **Search Intent Overlap Clustering**: Clustered 60 incoming keyword variants into 5 high/low overlap clusters; routed broad hub and category head terms (`obby games`, `parking games`, `parkour games`) to backlog to prevent keyword cannibalization against tag and hub pages.
- **On-Page Text History Tracking**: Logged complete before and after records across title tags, meta descriptions, H1 headings, and opening paragraphs to `reports/seo/onpage-text-history.csv`.
- **Off-Page Outreach Strategy**: Appended Section 10 to `reports/seo/offpage-plan.md` featuring 5 platform-tailored post templates, diversified anchor text guidelines, and compliance safeguards.

### Changed
- **Keyword Density & Mention Constraints**: Enforced `MAX_BODY_MENTIONS_PER_KEYWORD = 2` and `MAX_SECONDARY_PER_PAGE = 2` across all target pages.
- **Metadata Character Counts**: Titles strictly formatted within 50–56 characters (<=60); meta descriptions within 126–145 characters (120–155); H1 headings within 38–51 characters (<=70); first paragraphs within 58–73 words (<=100).

### Verified
- **Automated Quality Gate**: Passed `scripts/check-onpage-keywords.js` with 0 violations across 418 audited pages (0 excluded words, 0 banned claims, 0 mid-sentence truncations).

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
