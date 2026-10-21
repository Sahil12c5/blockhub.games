const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const {
  hashSlug,
  cleanFeedText,
  detectTrueProfile,
  extractControls,
  sanitizeVocabulary
} = require('./lib/individual-engine.js');

const {
  DRIVING_P1_BODIES,
  DRIVING_P2_BODIES,
  SHOOTING_P1_BODIES,
  SHOOTING_P2_BODIES,
  PUZZLE_P1_BODIES,
  PUZZLE_P2_BODIES,
  SPORTS_P1_BODIES,
  SPORTS_P2_BODIES,
  GENERAL_P1_BODIES,
  GENERAL_P2_BODIES
} = require('./lib/body-variations.js');

const { P1_OPENERS, P2_OPENERS } = require('./lib/factual-individual-writer.js');
const { get6WordRuns } = require('./lib/validator.js');

const scheduledGames = Object.values(topContent).filter(g => g.status === 'PASS_SCHEDULED');

console.log(`Simulating 636 scheduled games with game-specific facts...`);

const phraseToPages = new Map();
const sentenceToPages = new Map();
const openerPairs = new Map();

const genreCounters = {
  driving: 0,
  shooting: 0,
  puzzle: 0,
  sports: 0,
  general: 0
};

const scheduledGenerated = [];

for (const g of scheduledGames) {
  const profile = detectTrueProfile(g.title, g.category, g.subgenre, g.raw_description, g.raw_how_to);
  const { isDriving, isShooter, isSports, isPuzzle } = profile;
  const controls = extractControls(g.raw_how_to, g.howToPlay, profile);
  const ctrlKeys = controls.map(c => c.key).join(' and ');

  let gKey = 'general';
  let p1Pool = GENERAL_P1_BODIES;
  let p2Pool = GENERAL_P2_BODIES;
  if (isDriving) { gKey = 'driving'; p1Pool = DRIVING_P1_BODIES; p2Pool = DRIVING_P2_BODIES; }
  else if (isShooter) { gKey = 'shooting'; p1Pool = SHOOTING_P1_BODIES; p2Pool = SHOOTING_P2_BODIES; }
  else if (isPuzzle) { gKey = 'puzzle'; p1Pool = PUZZLE_P1_BODIES; p2Pool = PUZZLE_P2_BODIES; }
  else if (isSports) { gKey = 'sports'; p1Pool = SPORTS_P1_BODIES; p2Pool = SPORTS_P2_BODIES; }

  const bodyIdx = genreCounters[gKey]++ % p1Pool.length;

  const hash = hashSlug(g.slug);
  const p1Idx = hash % P1_OPENERS.length;
  const p2Idx = (hash * 31) % P2_OPENERS.length;

  const sub = (g.subgenre || '').toLowerCase();
  const title = g.title.toLowerCase();

  let setting = 'active challenge environments';
  if (isDriving) {
    if (sub.includes('parking') || title.includes('parking')) setting = 'compact parking structures';
    else if (sub.includes('truck') || title.includes('truck')) setting = 'demanding heavy transport routes';
    else setting = 'competitive roadway courses';
  } else if (isShooter) {
    if (sub.includes('sniper') || title.includes('sniper')) setting = 'elevated sniper perches';
    else if (sub.includes('zombie') || title.includes('zombie')) setting = 'contested survival outposts';
    else setting = 'intense combat sectors';
  } else if (isPuzzle) {
    if (profile.isMemory) setting = 'a structured memory card grid';
    else if (sub.includes('sort') || title.includes('sort')) setting = 'dense color sorting matrices';
    else setting = 'interlocking logic grids';
  } else if (isSports) {
    if (sub.includes('soccer') || title.includes('soccer') || title.includes('football')) setting = 'competitive soccer pitches';
    else setting = 'dynamic athletic tournament arenas';
  }

  let goal = 'complete each challenge with high precision';
  if (isDriving) {
    if (sub.includes('parking') || title.includes('parking')) goal = 'park vehicles cleanly within designated stalls';
    else if (sub.includes('truck') || title.includes('truck')) goal = 'haul heavy machinery across rugged terrain';
    else goal = 'reach the checkered flag without losing control';
  } else if (isShooter) {
    if (sub.includes('sniper') || title.includes('sniper')) goal = 'neutralize high-value targets across extreme ranges';
    else if (sub.includes('zombie') || title.includes('zombie')) goal = 'contain advancing waves of undead threats';
    else goal = 'eliminate hostile squads before defensive lines fall';
  } else if (isPuzzle) {
    if (profile.isMemory) goal = 'locate all matching card pairs across the board';
    else if (sub.includes('sort') || title.includes('sort')) goal = 'reorganize colored items into matching holding tubes';
    else goal = 'solve complex logical arrangements within par moves';
  } else if (isSports) {
    if (sub.includes('soccer') || title.includes('soccer') || title.includes('football')) goal = 'outscore opponent teams and convert penalty chances';
    else goal = 'defeat rival competitors in direct athletic contests';
  }

  let act = 'navigate through active sections';
  if (isDriving) act = 'steer through sharp turns, control throttle, and brake cleanly';
  else if (isShooter) act = 'acquire targets through crosshairs and fire with precision';
  else if (isPuzzle) act = profile.isMemory ? 'flip cards and track revealed symbol placements' : 'shift and arrange items into correct sequences';
  else if (isSports) act = 'time passes, execute shots, and maintain defensive coverage';

  let haz = 'dynamic stage hazards';
  if (isDriving) haz = 'narrow barrier walls and sharp asphalt curves';
  else if (isShooter) haz = 'incoming enemy volleys and aggressive flankers';
  else if (isPuzzle) haz = 'congested grid slots and finite move allowances';
  else if (isSports) haz = 'aggressive opponent markers and tight defensive lines';

  const p1Op = P1_OPENERS[p1Idx](g.title, goal, setting);
  const p2Op = P2_OPENERS[p2Idx](g.title, ctrlKeys, act, haz);

  let p1 = `${p1Op} ${p1Pool[bodyIdx]}`;
  let p2 = `${p2Op} ${p2Pool[bodyIdx]}`;

  p1 = sanitizeVocabulary(p1, g.category, g.subgenre, g.title);
  p2 = sanitizeVocabulary(p2, g.category, g.subgenre, g.title);

  // Guarantee no unverifiable words
  p1 = p1.replace(/\bachievements?\b/gi, 'victories').replace(/\bupgrades?\b/gi, 'skills').replace(/\blevels?\b/gi, 'stages').replace(/\bleaderboards?\b/gi, 'rankings');
  p2 = p2.replace(/\bachievements?\b/gi, 'victories').replace(/\bupgrades?\b/gi, 'skills').replace(/\blevels?\b/gi, 'stages').replace(/\bleaderboards?\b/gi, 'rankings');

  const desc = `${p1}\n\n${p2}`;

  const wCount = desc.split(/\s+/).filter(Boolean).length;
  scheduledGenerated.push({ slug: g.slug, desc, wCount });

  const runs = get6WordRuns(desc);
  for (const r of runs) {
    if (!phraseToPages.has(r)) phraseToPages.set(r, new Set());
    phraseToPages.get(r).add(g.slug);
  }

  for (const p of [p1, p2]) {
    const sents = p.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20);
    for (const s of sents) {
      const clean = s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (!sentenceToPages.has(clean)) sentenceToPages.set(clean, new Set());
      sentenceToPages.get(clean).add(g.slug);
    }
  }

  const p1O = p1.slice(0, 30);
  const p2O = p2.slice(0, 30);
  const pair = `${p1O} || ${p2O}`;
  openerPairs.set(pair, (openerPairs.get(pair) || 0) + 1);
}

console.log('\n--- SIMULATION RESULTS ACROSS 636 GAMES ---');
const words = scheduledGenerated.map(g => g.wCount);
console.log('Word counts min/max/avg:', Math.min(...words), Math.max(...words), (words.reduce((a,b)=>a+b,0)/words.length).toFixed(1));

let overusedPhrases = 0;
const overusedPhraseSamples = [];
for (const [r, pages] of phraseToPages.entries()) {
  if (pages.size > 5) {
    overusedPhrases++;
    if (overusedPhraseSamples.length < 10) overusedPhraseSamples.push({ phrase: r, count: pages.size });
  }
}
console.log(`6-word phrases appearing on > 5 pages: ${overusedPhrases}`);
if (overusedPhrases > 0) {
  console.log('Sample overused phrases:');
  overusedPhraseSamples.forEach(p => console.log(` - "${p.phrase}" on ${p.count} pages`));
}

let overusedSents = 0;
const overusedSentSamples = [];
for (const [s, pages] of sentenceToPages.entries()) {
  if (pages.size > 5) {
    overusedSents++;
    if (overusedSentSamples.length < 10) overusedSentSamples.push({ sent: s.slice(0, 50), count: pages.size });
  }
}
console.log(`Sentences appearing on > 5 pages: ${overusedSents}`);
if (overusedSents > 0) {
  console.log('Sample overused sentences:');
  overusedSentSamples.forEach(p => console.log(` - "${p.sent}..." on ${p.count} pages`));
}

let maxPairPct = 0;
for (const [pair, count] of openerPairs.entries()) {
  const pct = (count / scheduledGames.length) * 100;
  if (pct > maxPairPct) maxPairPct = pct;
}
console.log(`Max opener pair frequency: ${maxPairPct.toFixed(2)}% (limit <= 3.0%)`);
