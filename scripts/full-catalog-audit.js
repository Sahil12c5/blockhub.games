// scripts/full-catalog-audit.js
const fs = require('fs');
const tc = JSON.parse(fs.readFileSync('./data/top-games-content.json', 'utf8'));
const { get6WordRuns, validateQualityGates } = require('./lib/validator.js');

console.log('=== FULL CATALOG-WIDE AUDIT (636 SCHEDULED + 153 LIVE = 789 GAMES) ===\n');

const scheduled = Object.values(tc).filter(g => g.status === 'PASS_SCHEDULED');
const live = Object.values(tc).filter(g => g.status === 'PASS_LIVE');
const all789 = [...scheduled, ...live];

console.log(`Auditing ${all789.length} total games (${scheduled.length} scheduled, ${live.length} live)...`);

// 1. Check Quality Gates across all 636 scheduled
let schedFailures = 0;
scheduled.forEach(g => {
  const res = validateQualityGates(g);
  if (!res.passed) {
    schedFailures++;
    console.log(`FAIL [${g.slug}]:`, res.errors.join(' | '));
  }
});
console.log(`Quality gate check: ${scheduled.length - schedFailures}/${scheduled.length} PASS (failures: ${schedFailures})`);

// 2. 6-word phrase frequency across all 789 games
const runCounts = new Map();
all789.forEach(g => {
  const runs = get6WordRuns(g.description);
  runs.forEach(r => {
    runCounts.set(r, (runCounts.get(r) || 0) + 1);
  });
});

let overusedRuns = 0;
for (const [run, count] of runCounts.entries()) {
  if (count > 5) {
    overusedRuns++;
    console.log(`OVERUSED 6-WORD RUN (${count} pages > 5): "${run}"`);
  }
}
console.log(`6-word phrase overuse scan (>5 pages): ${overusedRuns} violations (PASS if 0)`);

// 3. Sentence frequency across all 789 games
const sentenceCounts = new Map();
all789.forEach(g => {
  const sents = g.description.split(/(?<=[.!?])\s+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const seenOnPage = new Set();
  sents.forEach(s => {
    if (!seenOnPage.has(s)) {
      sentenceCounts.set(s, (sentenceCounts.get(s) || 0) + 1);
      seenOnPage.add(s);
    }
  });
});

let overusedSentences = 0;
for (const [sent, count] of sentenceCounts.entries()) {
  if (count > 5) {
    overusedSentences++;
    console.log(`OVERUSED SENTENCE (${count} pages > 5): "${sent.slice(0, 60)}..."`);
  }
}
console.log(`Sentence overuse scan (>5 pages): ${overusedSentences} violations (PASS if 0)`);

// 4. Meta description lengths
let invalidMetaDesc = 0;
scheduled.forEach(g => {
  const len = (g.meta_description || '').length;
  if (len < 140 || len > 160) {
    invalidMetaDesc++;
    console.log(`INVALID META DESC [${g.slug}]: ${len} chars`);
  }
});
console.log(`Meta description length check (140-160 chars): ${scheduled.length - invalidMetaDesc}/${scheduled.length} PASS`);

// 5. Title lengths and boundary
let invalidTitles = 0;
scheduled.forEach(g => {
  const title = g.meta_title || '';
  if (title.length > 60 || !title.endsWith(' | BlockHub.games')) {
    invalidTitles++;
    console.log(`INVALID TITLE [${g.slug}]: ${title} (${title.length} chars)`);
  }
});
console.log(`Title length check (<= 60 chars ending in brand): ${scheduled.length - invalidTitles}/${scheduled.length} PASS`);

// 6. Word count range
let invalidWordCount = 0;
scheduled.forEach(g => {
  const words = g.description.split(/\s+/).filter(Boolean).length;
  if (words < 170 || words > 240) {
    invalidWordCount++;
    console.log(`OUT OF RANGE WORD COUNT [${g.slug}]: ${words} words`);
  }
});
console.log(`Word count range check (170-240 words): ${scheduled.length - invalidWordCount}/${scheduled.length} PASS`);

// 7. Facts used mapping and generator field
let missingGenerator = 0;
let missingFactsUsed = 0;
scheduled.forEach(g => {
  if (g.generator !== 'individual') missingGenerator++;
  if (!g.facts_used) missingFactsUsed++;
});
console.log(`Generator field check (individual): ${scheduled.length - missingGenerator}/${scheduled.length} PASS`);
console.log(`Facts used mapping check: ${scheduled.length - missingFactsUsed}/${scheduled.length} PASS`);

// 8. Indexable flag check
let indexableTrue = 0;
scheduled.forEach(g => {
  if (g.indexable !== false) indexableTrue++;
});
console.log(`Pre-release indexable status (must be false): ${scheduled.length - indexableTrue}/${scheduled.length} PASS (indexable: false)`);
