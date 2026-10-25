/**
 * scripts/check-onpage-keywords.js
 * 
 * Verifies:
 * 1. Pages changed count
 * 2. Pages with more than 3 keyword phrases added (must be 0)
 * 3. Any excluded word found in visible text (must be 0)
 * 4. Any banned claim found in added text (leaderboard, achievement, boss, multi-level, diesel, tuning, zero lag, co-op, family-friendly, account, tournament)
 * 5. Any added sentence on more than 2 pages in added paragraphs (must be 0)
 * 
 * Exits with code 1 if any rule is violated, 0 if all pass.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const csvPath = path.join(ROOT, 'reports', 'onpage-keywords-diff.csv');

if (!fs.existsSync(csvPath)) {
  console.error(`ERROR: CSV report not found at ${csvPath}`);
  process.exit(1);
}

// Parse CSV
const csvText = fs.readFileSync(csvPath, 'utf8');
const lines = csvText.split('\n').filter(l => l.trim().length > 0);

function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

const header = parseCsvLine(lines[0]);
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const f = parseCsvLine(lines[i]);
  if (f.length >= 5) {
    rows.push({
      page: f[0],
      element: f[1],
      before: f[2],
      after: f[3],
      keywords_added: f[4]
    });
  }
}

// 1. Pages changed
const pagesSet = new Set(rows.map(r => r.page));
const pagesChanged = pagesSet.size;

// 2. Pages with more than 3 keyword phrases
const pageKeywordsMap = new Map();
rows.forEach(r => {
  if (!pageKeywordsMap.has(r.page)) {
    pageKeywordsMap.set(r.page, new Set());
  }
  const kws = r.keywords_added.split('|').map(k => k.trim().toLowerCase()).filter(Boolean);
  kws.forEach(k => pageKeywordsMap.get(r.page).add(k));
});

const pagesOver3Kws = [];
for (const [page, kws] of pageKeywordsMap.entries()) {
  if (kws.size > 3) {
    pagesOver3Kws.push({ page, count: kws.size, keywords: Array.from(kws) });
  }
}

// 3. Excluded words in visible text (intro_paragraph, related_games_heading)
const excludedPatterns = [
  { name: 'poki', regex: /\bpoki\b/i },
  { name: 'friv', regex: /\bfriv\b/i },
  { name: 'y8', regex: /\by8\b/i },
  { name: 'crazy games', regex: /\bcrazy\s*games\b/i },
  { name: '1001 oyun', regex: /1001\s*oyun/i },
  { name: 'github io', regex: /github\.?io/i },
  { name: 'unblocked', regex: /unblocked/i },
  { name: 'classroom', regex: /\bclassroom\b/i },
  { name: 'school', regex: /\bschool\b/i },
  { name: 'flash', regex: /\bflash\b/i },
  { name: 'world cup', regex: /\bworld\s*cup\b/i },
  { name: 'for pc / pc games', regex: /\b(for\s+pc|pc\s+games)\b/i },
  { name: 'casino/betting', regex: /\b(casino|betting|gambling|slots|poker|roulette|blackjack|jackpot)\b/i },
  { name: 'non-English', regex: /\b(oyun|oyunlar|oyunları|juegos|العاب|ігри|gratis)\b/i }
];

const visibleRows = rows.filter(r => r.element === 'intro_paragraph' || r.element === 'related_games_heading');
const excludedViolations = [];

visibleRows.forEach(r => {
  const text = r.after;
  excludedPatterns.forEach(p => {
    if (p.regex.test(text)) {
      excludedViolations.push({
        page: r.page,
        element: r.element,
        pattern: p.name,
        text
      });
    }
  });
});

// Also check meta descriptions for 'unblocked'
const metaRows = rows.filter(r => r.element === 'meta_description');
metaRows.forEach(r => {
  if (/unblocked/i.test(r.after)) {
    excludedViolations.push({
      page: r.page,
      element: r.element,
      pattern: 'unblocked in meta',
      text: r.after
    });
  }
});

// 4. Banned Claims in added text (leaderboard, achievement, boss, multi-level, diesel, tuning, zero lag, co-op, family-friendly, account, tournament)
const bannedClaims = [
  { name: 'leaderboard', regex: /leaderboard/i },
  { name: 'achievement', regex: /achievement/i },
  { name: 'boss', regex: /\bboss(es)?\b/i },
  { name: 'multi-level', regex: /multi[-\s]?level/i },
  { name: 'diesel', regex: /diesel/i },
  { name: 'tuning', regex: /tuning/i },
  { name: 'zero lag', regex: /zero[-\s]?lag/i },
  { name: 'co-op', regex: /\bco[-\s]?op\b/i },
  { name: 'family-friendly', regex: /family[-\s]?friendly/i },
  { name: 'account', regex: /\baccount(s)?\b/i },
  { name: 'tournament', regex: /tournament/i }
];

const bannedClaimViolations = [];
rows.forEach(r => {
  const text = r.after;
  bannedClaims.forEach(c => {
    if (c.regex.test(text)) {
      bannedClaimViolations.push({
        page: r.page,
        element: r.element,
        claim: c.name,
        text
      });
    }
  });
});

// 5. Any added sentence on more than 2 pages (Rule 5: "Write each added paragraph by hand for its page. No added sentence may appear on more than 2 pages.")
const paragraphRows = rows.filter(r => r.element === 'intro_paragraph');
const sentenceToPages = new Map();

paragraphRows.forEach(r => {
  const sents = r.after.split(/(?<=[.!?])\s+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  sents.forEach(s => {
    if (!sentenceToPages.has(s)) {
      sentenceToPages.set(s, new Set());
    }
    sentenceToPages.get(s).add(r.page);
  });
});

const sentenceViolations = [];
for (const [sent, pages] of sentenceToPages.entries()) {
  if (pages.size > 2) {
    sentenceViolations.push({
      sentence: sent,
      pageCount: pages.size,
      pages: Array.from(pages)
    });
  }
}

// 6. Check that no game meta_description in data/top-games-content.json ends mid-sentence
const topContent = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'top-games-content.json'), 'utf8'));
const midSentenceRegexes = [
  /\bPlay\.\s*$/i,
  /\bJump\.\s*$/i,
  /\bEnjoy\.\s*$/i,
  /\bdirectly in\.\s*$/i,
  /\bin your\.\s*$/i,
  /\bPlay directly\.\s*$/i,
  /\bExperience fast\.\s*$/i,
  /\bExperience fast loading\.\s*$/i,
  /\bEnjoy smooth\.\s*$/i,
  /\bFast HTML5\.\s*$/i,
  /\bResponsive HTML5\.\s*$/i,
  /\bSmooth 60\.\s*$/i,
  /\bcontrols with\.\s*$/i,
  /\bwith no\.\s*$/i,
  /\bcollect route\.\s*$/i,
  /\bdynamic obstacle\.\s*$/i,
  /\bMaster each\.\s*$/i,
  /\bprogressive brain\.\s*$/i,
  /\bsmooth browser\.\s*$/i,
  /\binstant browser\.\s*$/i,
  /\b4 players\.\s*$/i,
  /\brunner standing\.\s*$/i,
  /\.\.$/
];

const midSentenceViolations = [];
for (const [slug, data] of Object.entries(topContent)) {
  const meta = (data.meta_description || '').trim();
  if (!meta.endsWith('.') || midSentenceRegexes.some(r => r.test(meta))) {
    midSentenceViolations.push({ slug, meta });
  }
}

// Print Results
console.log('====================================================');
console.log('ON-PAGE KEYWORDS & CLAIMS AUDIT REPORT');
console.log('====================================================');
console.log(`Pages changed: ${pagesChanged}`);
console.log(`Pages with > 3 keyword phrases: ${pagesOver3Kws.length}`);
console.log(`Excluded words found in visible text: ${excludedViolations.length}`);
console.log(`Banned claims found in added text: ${bannedClaimViolations.length}`);
console.log(`Added sentences on > 2 pages: ${sentenceViolations.length}`);
console.log(`Game descriptions ending mid-sentence: ${midSentenceViolations.length}`);
console.log('----------------------------------------------------');

let failed = false;

if (pagesOver3Kws.length > 0) {
  failed = true;
  console.error('\nFAILURE: Pages with more than 3 keyword phrases:');
  pagesOver3Kws.forEach(p => {
    console.error(`- ${p.page}: ${p.count} keywords (${p.keywords.join(', ')})`);
  });
}

if (excludedViolations.length > 0) {
  failed = true;
  console.error('\nFAILURE: Excluded word violations found:');
  excludedViolations.forEach(v => {
    console.error(`- [${v.pattern}] on ${v.page} (${v.element}): "${v.text}"`);
  });
}

if (bannedClaimViolations.length > 0) {
  failed = true;
  console.error('\nFAILURE: Banned claims found in added text:');
  bannedClaimViolations.forEach(v => {
    console.error(`- [${v.claim}] on ${v.page} (${v.element}): "${v.text}"`);
  });
}

if (sentenceViolations.length > 0) {
  failed = true;
  console.error('\nFAILURE: Sentence appeared on more than 2 pages:');
  sentenceViolations.forEach(s => {
    console.error(`- On ${s.pageCount} pages: "${s.sentence}"`);
  });
}

if (midSentenceViolations.length > 0) {
  failed = true;
  console.error('\nFAILURE: Game meta descriptions ending mid-sentence:');
  midSentenceViolations.forEach(m => {
    console.error(`- [${m.slug}]: "${m.meta}"`);
  });
}

if (failed) {
  console.error('\nCHECK RESULT: FAILED');
  process.exit(1);
} else {
  console.log('CHECK RESULT: PASSED ALL TESTS PERFECTLY');
  process.exit(0);
}

