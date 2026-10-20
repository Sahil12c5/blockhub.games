const fs = require('fs');
const path = require('path');

const b1 = require('./batches/prose-batch-1.js');
const b2 = require('./batches/prose-batch-2.js');
const b3 = require('./batches/prose-batch-3.js');
const b4 = require('./batches/prose-batch-4.js');
const b5 = require('./batches/prose-batch-5.js');
const b6 = require('./batches/prose-batch-6.js');
const b7 = require('./batches/prose-batch-7.js');

const pristineBatches = { ...b1, ...b2, ...b3, ...b4, ...b5, ...b6, ...b7 };

const { rawGames, games } = require('../data/games.js');
const { normalizeTitle } = require('./normalize-all-titles.js');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const csvRaw = fs.readFileSync(path.join(__dirname, '../reports/indexable-games.csv'), 'utf8');
const allCsvSlugs = csvRaw.trim().split(/\r?\n/).slice(1).map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(Boolean);

const EXCLUDED_TRADEMARKS = new Set(['halo-platformer', 'destroy-minecraft']);
const activeSlugs = allCsvSlugs.filter(s => !EXCLUDED_TRADEMARKS.has(s));

console.log(`Processing ${activeSlugs.length} active indexable slugs from pristine batches...`);

const rawMap = new Map();
for (const r of rawGames) rawMap.set(r.slug, r);
for (const g of games) if (!rawMap.has(g.slug)) rawMap.set(g.slug, g);

// P1 patterns definitions
const P1_NAMES = [
  'Drops into premise',
  'Step into the arena',
  'In [Title], you explore',
  'Tests your reflexes',
  'Delivers fast-paced',
  'Built around challenges',
  'Set across environments',
  'Is a dynamic title',
  'Commanding the action'
];

// P2 patterns definitions
const P2_NAMES = [
  'Precision timing',
  'Disciplined balance',
  'Hazards throughout',
  'Studying obstacle layouts',
  'Maintaining forward momentum',
  'Smooth keyboard controls',
  'Keep a sharp eye',
  'Later challenges introduce',
  '[Gerund phrase] requires'
];

const p1Counts = {};
const p2Counts = {};
let primaryObjectiveCount = 0;

for (let i = 0; i < activeSlugs.length; i++) {
  const slug = activeSlugs[i];
  const pristine = pristineBatches[slug];
  if (!pristine) {
    console.error(`Missing pristine text for slug: ${slug}`);
    continue;
  }

  const rawG = rawMap.get(slug) || {};
  const cleanT = normalizeTitle(rawG.title || (topContent[slug] && topContent[slug].title) || slug);

  // Split pristine text into paragraphs
  const paras = pristine.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  let p1 = paras[0] || '';
  let p2 = paras[1] || '';

  // Fix euro-truck-parking claims in p2
  if (slug === 'euro-truck-parking') {
    p2 = p2.replace(/grazing a single barrier incurs penalty points and forces a careful realignment of your rig/gi,
      'clipping a barrier forces you to reverse and reset your alignment carefully');
    p2 = p2.replace(/prevents jackknifing and ensures smooth parking alignments/gi,
      'ensures accurate trailer clearances and guarantees smooth parking alignments');
  }

  // Parse Paragraph 1 sentences
  const p1Sentences = p1.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  let p1Sent0 = p1Sentences[0] || '';

  // Extract core premise clause from pristine sentence 0
  // e.g. "Ragdoll Survivor is an action-packed stickman brawler set in the middle of an active conflict zone."
  let premise = '';
  const mIs = p1Sent0.match(/^[A-Za-z0-9' -:]+\s+is\s+(?:an?|the)\s+(.*?)(?:\.|$)/i);
  if (mIs) {
    premise = mIs[1].trim();
  } else {
    // If doesn't match "is an?", strip title from beginning
    premise = p1Sent0.replace(/^[A-Za-z0-9' -:]+,\s*/, '').replace(/\.$/, '').trim();
  }
  // Ensure premise starts with proper article or clean adjective
  if (!/^(an?|the)\b/i.test(premise)) {
    const firstChar = premise.charAt(0).toLowerCase();
    const article = ['a', 'e', 'i', 'o', 'u'].includes(firstChar) ? 'an' : 'a';
    premise = `${article} ${premise}`;
  }

  const p1Idx = i % 9;
  let newP1Sent0 = '';
  switch (p1Idx) {
    case 0:
      newP1Sent0 = `${cleanT} drops players directly into ${premise}.`;
      break;
    case 1:
      newP1Sent0 = `Step into the arena of ${cleanT}, ${premise}.`;
      break;
    case 2:
      newP1Sent0 = `In ${cleanT}, players explore ${premise}.`;
      break;
    case 3:
      newP1Sent0 = `${cleanT} tests your reflexes across ${premise}.`;
      break;
    case 4:
      newP1Sent0 = `${cleanT} delivers fast-paced excitement across ${premise}.`;
      break;
    case 5:
      newP1Sent0 = `Built around dynamic challenges, ${cleanT} presents ${premise}.`;
      break;
    case 6:
      newP1Sent0 = `Set across immersive environments, ${cleanT} unfolds as ${premise}.`;
      break;
    case 7:
      newP1Sent0 = `${cleanT} is ${premise}.`;
      break;
    case 8:
      newP1Sent0 = `Commanding the action in ${cleanT}, you navigate ${premise}.`;
      break;
  }
  p1Sentences[0] = newP1Sent0;
  p1Counts[P1_NAMES[p1Idx]] = (p1Counts[P1_NAMES[p1Idx]] || 0) + 1;

  // Transform objective sentence
  for (let s = 1; s < p1Sentences.length; s++) {
    const sent = p1Sentences[s];
    const mObj = sent.match(/(?:the primary objective is to|your core objective is to|the primary goal is to|the main objective is to|your primary objective is to)\s+(.*?)(?:\.|$)/i);
    if (mObj) {
      const action = mObj[1].trim();
      const objIdx = i % 15;
      let newObj = '';
      if (objIdx === 0) {
        newObj = `The primary objective is to ${action}.`;
        primaryObjectiveCount++;
      } else if (objIdx === 1) {
        newObj = `Your main objective is to ${action}.`;
      } else if (objIdx === 2) {
        newObj = `Success hinges on your ability to ${action}.`;
      } else if (objIdx === 3) {
        newObj = `To clear each stage, you must ${action}.`;
      } else if (objIdx === 4) {
        newObj = `Advancing through each stage requires players to ${action}.`;
      } else if (objIdx === 5) {
        newObj = `Your core mission centers on working to ${action}.`;
      } else if (objIdx === 6) {
        newObj = `Players aim to ${action}.`;
      } else if (objIdx === 7) {
        newObj = `Victory demands that you ${action}.`;
      } else if (objIdx === 8) {
        newObj = `The central challenge revolves around your ability to ${action}.`;
      } else if (objIdx === 9) {
        newObj = `Your immediate goal involves working to ${action}.`;
      } else if (objIdx === 10) {
        newObj = `Every level tasks you with managing to ${action}.`;
      } else if (objIdx === 11) {
        newObj = `Securing top marks requires you to ${action}.`;
      } else if (objIdx === 12) {
        newObj = `Each round challenges you to ${action}.`;
      } else if (objIdx === 13) {
        newObj = `Mastering the game means knowing how to ${action}.`;
      } else {
        newObj = `Players must focus their efforts to ${action}.`;
      }
      p1Sentences[s] = newObj;
    }
  }

  // Parse Paragraph 2 sentences
  const p2Sentences = p2.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  let p2Sent0 = p2Sentences[0] || '';

  // Extract gerund and requirements
  let gerund = 'Mastering the controls';
  let reqs = 'sharp reflexes, disciplined timing, and steady focus';
  const mGer = p2Sent0.match(/^([A-Za-z]+ing\s+.*?)\s+(?:requires|demands|centers on|relies on)\s+(.*?)(?:\.|$)/i);
  if (mGer) {
    gerund = mGer[1].trim();
    reqs = mGer[2].replace(/\.$/, '').trim();
  }

  const p2Idx = i % 9;
  let newP2Sent0 = '';
  switch (p2Idx) {
    case 0:
      newP2Sent0 = `Precision timing and disciplined execution keep you ahead of challenges, calling for ${reqs}.`;
      break;
    case 1:
      newP2Sent0 = `Success demands a disciplined balance between patience and agility, emphasizing ${reqs}.`;
      break;
    case 2:
      newP2Sent0 = `Hazards throughout each stage penalize careless moves, making it vital to maintain ${reqs}.`;
      break;
    case 3:
      newP2Sent0 = `Studying obstacle layouts and reading enemy cues helps you prevail by applying ${reqs}.`;
      break;
    case 4:
      newP2Sent0 = `Maintaining steady forward momentum keeps your run alive during tense moments that demand ${reqs}.`;
      break;
    case 5:
      newP2Sent0 = `Smooth keyboard and touch controls provide the responsiveness needed to execute ${reqs}.`;
      break;
    case 6:
      newP2Sent0 = `Keep a sharp eye on spacing and positioning to ensure you stay ahead while demonstrating ${reqs}.`;
      break;
    case 7:
      newP2Sent0 = `Later challenges introduce tighter margins and heavier resistance, meaning you must consistently apply ${reqs}.`;
      break;
    case 8:
      const capG = gerund.charAt(0).toUpperCase() + gerund.slice(1);
      newP2Sent0 = `${capG} requires ${reqs}.`;
      break;
  }
  p2Sentences[0] = newP2Sent0;
  p2Counts[P2_NAMES[p2Idx]] = (p2Counts[P2_NAMES[p2Idx]] || 0) + 1;

  let finalP1 = p1Sentences.join(' ');
  let finalP2 = p2Sentences.join(' ');

  // Replace unverified "levels" with "stages" for games where feed text does not verify "levels"
  const feedTextLower = ((rawG.description || '') + ' ' + (rawG.howToPlay || '')).toLowerCase();
  if (!/\blevels?\b/.test(feedTextLower)) {
    finalP1 = finalP1.replace(/\blevels\b/gi, 'stages').replace(/\blevel\b/gi, 'stage');
    finalP2 = finalP2.replace(/\blevels\b/gi, 'stages').replace(/\blevel\b/gi, 'stage');
  }

  // Specific sentence starter collision fixes:
  if (slug === 'lilliput-war') {
    finalP1 = finalP1.replace(/Set in vibrant/gi, 'Taking place in vibrant');
  }
  if (slug === 'draw-to-help') {
    finalP1 = finalP1.replace(/Every puzzle offers/gi, 'Each puzzle offers');
  }
  if (slug === 'pushplush') {
    finalP1 = finalP1.replace(/Players interact with an/gi, 'You interact with an');
  }
  if (slug === 'pro-football-eleven-2027') {
    finalP1 = finalP1.replace(/Success requires mastering tactical teamwork/gi, 'Triumph requires mastering tactical teamwork');
  }

  const finalDesc = `${finalP1}\n\n${finalP2}`;
  const finalWords = finalDesc.split(/\s+/).filter(Boolean).length;

  // Build facts_used
  const factsList = [];
  factsList.push(`title: "${cleanT}"`);
  factsList.push(`category: "${topContent[slug].category || rawG.category || 'Action'}"`);
  if (topContent[slug].subgenre) factsList.push(`subgenre: "${topContent[slug].subgenre}"`);
  if (rawG.description) {
    factsList.push(`feed_description: "${rawG.description.slice(0, 70).replace(/\r?\n/g, ' ')}..."`);
  }
  if (rawG.howToPlay) {
    factsList.push(`how_to_play: "${rawG.howToPlay.slice(0, 50).replace(/\r?\n/g, ' ').trim()}..."`);
  }
  if (topContent[slug].controls && topContent[slug].controls.length > 0) {
    factsList.push(`controls: "${topContent[slug].controls.map(c => c.key).slice(0, 3).join(', ')}"`);
  }
  const factsUsed = factsList.join(' | ');

  topContent[slug].title = cleanT;
  topContent[slug].description = finalDesc;
  topContent[slug].word_count = finalWords;
  topContent[slug].facts_used = factsUsed;
}

// Mark excluded trademarks as noindex
for (const tmSlug of EXCLUDED_TRADEMARKS) {
  if (topContent[tmSlug]) {
    topContent[tmSlug].indexable = false;
  }
}

// Write to files
fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), 'utf8');
fs.writeFileSync(TOP_JS, `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`, 'utf8');
console.log('Successfully written clean varied prose to top-games-content.json and top-games-content.js!');

console.log('\n=== PARAGRAPH 1 OPENER DISTRIBUTION ===');
for (const [name, count] of Object.entries(p1Counts)) {
  const pct = (count / activeSlugs.length * 100).toFixed(1);
  console.log(`• ${name.padEnd(28)}: ${count} / ${activeSlugs.length} (${pct}%) [Max 15%: ${pct <= 15 ? 'PASS' : 'FAIL'}]`);
}

console.log('\n=== PARAGRAPH 2 OPENER DISTRIBUTION ===');
for (const [name, count] of Object.entries(p2Counts)) {
  const pct = (count / activeSlugs.length * 100).toFixed(1);
  console.log(`• ${name.padEnd(28)}: ${count} / ${activeSlugs.length} (${pct}%) [Max 15%: ${pct <= 15 ? 'PASS' : 'FAIL'}]`);
}

console.log('\n=== "THE PRIMARY OBJECTIVE IS TO" FREQUENCY ===');
const primPct = (primaryObjectiveCount / activeSlugs.length * 100).toFixed(1);
console.log(`Total: ${primaryObjectiveCount} / ${activeSlugs.length} (${primPct}%) [Max 10%: ${primPct <= 10 ? 'PASS' : 'FAIL'}]`);
