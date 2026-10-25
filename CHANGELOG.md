# Changelog

All notable changes to the BlockHub.games platform are documented in this file.

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
