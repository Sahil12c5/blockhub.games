const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const {
  validateQualityGates,
  validateCatalogPatterns,
  get5WordShingles,
  get6WordRuns,
  DRIVING_TERMS,
  SHOOTING_TERMS,
  PUZZLE_TERMS,
  PLATFORMER_TERMS,
  SPORTS_TERMS,
  FIGHTING_TERMS,
  IDLE_STACKING_TERMS,
  MEMORY_CARD_TERMS,
  RACING_EXCLUSIVE_TERMS
} = require('./lib/validator.js');

console.log('=== RUNNING FULL CATALOG AUDIT (636 SCHEDULED + 153 LIVE = 789 GAMES) ===\n');

const liveGames = Object.values(topContent).filter(g => g.status === 'PASS_LIVE');
const scheduledGames = Object.values(topContent).filter(g => g.status === 'PASS_SCHEDULED');
const targetGames = [...liveGames, ...scheduledGames];

console.log(`Total target games to audit: ${targetGames.length} (${liveGames.length} live + ${scheduledGames.length} scheduled)\n`);

const issues = [];

// 1. Quality Gates per Game
console.log('1. Checking quality gates per game...');
let gateFailures = 0;
for (const g of targetGames) {
  const res = validateQualityGates(g);
  if (!res.passed) {
    gateFailures++;
    issues.push(`[QualityGateFail] ${g.slug}: ${res.errors.join('; ')}`);
  }
}
console.log(`Quality gate failures: ${gateFailures}`);

// 2. 6-Word Phrase Fingerprint Scan across all 789 games (flag if > 5 pages)
console.log('2. Running 6-word phrase fingerprint scan...');
const phraseToPages = new Map();
for (const g of targetGames) {
  const runs = get6WordRuns(g.description || '');
  for (const r of runs) {
    if (!phraseToPages.has(r)) phraseToPages.set(r, new Set());
    phraseToPages.get(r).add(g.slug);
  }
}

let phraseOverusedCount = 0;
for (const [phrase, pages] of phraseToPages.entries()) {
  if (pages.size > 5) {
    phraseOverusedCount++;
    if (phraseOverusedCount <= 10) {
      issues.push(`[PhraseOverused >5 pages] "${phrase}" appears on ${pages.size} pages: ${Array.from(pages).slice(0, 3).join(', ')}...`);
    }
  }
}
console.log(`6-word phrases appearing on > 5 pages: ${phraseOverusedCount}`);

// 3. Identical controls tables across different subgenres
console.log('3. Checking controls tables across different subgenres...');
const controlsToSubgenres = new Map();
for (const g of targetGames) {
  if (!g.controls || g.controls.length === 0) continue;
  const ctrlKey = g.controls.map(c => `${c.key}:${c.action}`).join('|');
  const sub = (g.subgenre || g.category || 'none').toLowerCase();
  if (!controlsToSubgenres.has(ctrlKey)) controlsToSubgenres.set(ctrlKey, new Map());
  const subMap = controlsToSubgenres.get(ctrlKey);
  if (!subMap.has(sub)) subMap.set(sub, []);
  subMap.get(sub).push(g.slug);
}

let suspiciousControlsSharing = 0;
for (const [ctrlKey, subMap] of controlsToSubgenres.entries()) {
  // If identical multi-row controls are shared between completely incompatible subgenres (e.g. parking vs fps)
  const subs = Array.from(subMap.keys());
  if (subs.length > 1) {
    const isParking = subs.some(s => s.includes('parking'));
    const isShooter = subs.some(s => s.includes('fps') || s.includes('sniper') || s.includes('shooter'));
    const isPuzzle = subs.some(s => s.includes('puzzle') || s.includes('sort') || s.includes('match'));
    if ((isParking && isShooter) || (isParking && isPuzzle) || (isShooter && isPuzzle)) {
      suspiciousControlsSharing++;
      issues.push(`[IdenticalControlsConflict] Controls shared between incompatible subgenres (${subs.join(', ')}): ${ctrlKey.slice(0, 60)}...`);
    }
  }
}
console.log(`Incompatible subgenres sharing identical controls: ${suspiciousControlsSharing}`);

// 4. Opener Pair Distribution across all 789 games
console.log('4. Checking opener pair distribution across all games...');
const openerPairMap = new Map();
for (const g of targetGames) {
  const paras = (g.description || '').split(/\n\s*\n/);
  const p1 = (paras[0] || '').trim();
  const p2 = (paras[1] || '').trim();
  const p1Opener = (p1.split(/(?<=[.!?])\s+/)[0] || '').slice(0, 30);
  const p2Opener = (p2.split(/(?<=[.!?])\s+/)[0] || '').slice(0, 30);
  const pair = `${p1Opener} || ${p2Opener}`;
  openerPairMap.set(pair, (openerPairMap.get(pair) || 0) + 1);
}

let maxPairPct = 0;
let maxPairKey = '';
for (const [pair, count] of openerPairMap.entries()) {
  const pct = (count / targetGames.length) * 100;
  if (pct > maxPairPct) {
    maxPairPct = pct;
    maxPairKey = pair;
  }
  if (pct > 3.0) {
    issues.push(`[OpenerPairExceeded >3%] "${pair}" appears on ${count}/${targetGames.length} pages (${pct.toFixed(2)}%)`);
  }
}
console.log(`Max opener pair frequency: ${maxPairPct.toFixed(2)}% (limit <= 3.0%: ${maxPairPct <= 3.0 ? 'PASS' : 'FAIL'})`);

// 5. Check Sentence Overuse across pages (> 5)
console.log('5. Checking sentence reuse across pages...');
const sentenceToPages = new Map();
for (const g of targetGames) {
  const paras = (g.description || '').split(/\n\s*\n/);
  for (const p of paras) {
    const sents = p.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20);
    for (const s of sents) {
      const clean = s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!sentenceToPages.has(clean)) sentenceToPages.set(clean, new Set());
      sentenceToPages.get(clean).add(g.slug);
    }
  }
}

let sentenceOverusedCount = 0;
for (const [s, pages] of sentenceToPages.entries()) {
  if (pages.size > 5) {
    sentenceOverusedCount++;
    if (sentenceOverusedCount <= 10) {
      issues.push(`[SentenceOverused >5 pages] "${s.slice(0, 50)}..." on ${pages.size} pages`);
    }
  }
}
console.log(`Sentences appearing on > 5 pages: ${sentenceOverusedCount}`);

// 6. Cross-field consistency (About vs Controls vs Tips vs FAQ)
console.log('6. Checking cross-field consistency...');
let crossFieldMismatches = 0;
for (const g of targetGames) {
  const desc = (g.description || '').toLowerCase();
  const tips = (g.tips || []).join(' ').toLowerCase();
  const faq = (g.faq || []).map(f => f.q + ' ' + f.a).join(' ').toLowerCase();
  const cat = (g.category || '').toLowerCase();
  const sub = (g.subgenre || '').toLowerCase();

  // If About is parking, tips/faq must not have fighter combos or sniper scopes
  if (sub.includes('parking') || cat === 'racing') {
    if (tips.includes('crosshair') || tips.includes('headshot') || faq.includes('crosshair') || faq.includes('headshot')) {
      crossFieldMismatches++;
      issues.push(`[CrossFieldMismatch] ${g.slug} (driving/parking) has shooting tips/faq`);
    }
    if (tips.includes('combo') || faq.includes('combo')) {
      crossFieldMismatches++;
      issues.push(`[CrossFieldMismatch] ${g.slug} (driving/parking) has fighting tips/faq`);
    }
  }

  // If About is puzzle/memory, tips/faq must not have throttle/brakes or crosshairs
  if (cat === 'puzzle' || sub.includes('memory') || sub.includes('puzzle')) {
    if (tips.includes('throttle') || tips.includes('handbrake') || faq.includes('throttle')) {
      crossFieldMismatches++;
      issues.push(`[CrossFieldMismatch] ${g.slug} (puzzle/memory) has driving tips/faq`);
    }
  }
}
console.log(`Cross-field consistency mismatches: ${crossFieldMismatches}`);

console.log('\n=== AUDIT SUMMARY ===');
console.log(`Total Issues Found: ${issues.length}`);
if (issues.length > 0) {
  console.log('Issues preview:');
  issues.slice(0, 20).forEach(iss => console.log(' - ' + iss));
} else {
  console.log('PERFECT CLEAN AUDIT! All checks passed with 0 issues!');
}
