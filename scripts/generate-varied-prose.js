const fs = require('fs');
const path = require('path');

const { rawGames, games } = require('../data/games.js');
const { normalizeTitle } = require('./normalize-all-titles.js');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const csvRaw = fs.readFileSync(path.join(__dirname, '../reports/indexable-games.csv'), 'utf8');
const allCsvSlugs = csvRaw.trim().split(/\r?\n/).slice(1).map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(Boolean);

// Slugs to exclude from indexable catalog due to trademarks
const EXCLUDED_TRADEMARKS = new Set(['halo-platformer', 'destroy-minecraft']);
const activeSlugs = allCsvSlugs.filter(s => !EXCLUDED_TRADEMARKS.has(s));

console.log(`Active slugs count: ${activeSlugs.length}`);

// Fix galaxy-pop subgenre
if (topContent['galaxy-pop']) {
  topContent['galaxy-pop'].subgenre = 'bubble-shooter';
}

// Map of raw feeds
const rawMap = new Map();
for (const r of rawGames) rawMap.set(r.slug, r);
for (const g of games) if (!rawMap.has(g.slug)) rawMap.set(g.slug, g);

// Structure for tracking facts used
function generateFactsUsed(slug, title, category, subgenre, rawG, desc) {
  const facts = [];
  facts.push(`title: "${title}"`);
  facts.push(`category: "${category}"`);
  if (subgenre) facts.push(`subgenre: "${subgenre}"`);
  
  if (rawG) {
    if (rawG.description) {
      // Extract key phrase from raw description
      const rawSentences = rawG.description.split(/(?<=[.!?])\s+/);
      if (rawSentences[0]) facts.push(`raw_description: "${rawSentences[0].slice(0, 60)}..."`);
    }
    if (rawG.howToPlay) {
      facts.push(`howToPlay: "${rawG.howToPlay.slice(0, 50).trim()}..."`);
    }
    if (rawG.controls && rawG.controls.length > 0) {
      const keys = rawG.controls.map(c => c.key).slice(0, 3).join(', ');
      facts.push(`controls: "${keys}"`);
    }
  }
  return facts.join(' | ');
}

// Patterns definitions for classification
const P1_PATTERNS = [
  { id: 'drop', name: '[Title] drops players into...', test: (s) => /^\S.*?\b(drops|plunges|thrusts)\s+players\s+into\b/i },
  { id: 'step_into', name: 'Step into the world/arena of [Title]...', test: (s) => /^(step into|enter)\s+(the\s+)?(world|arena|realm)\s+of\b/i },
  { id: 'in_title', name: 'In [Title], you/players command...', test: (s) => /^in\s+[A-Z0-9].*?,\s*(you|players)\b/i },
  { id: 'tests_reflexes', name: '[Title] tests your reflexes/skills...', test: (s) => /^\S.*?\btests?\s+(your|player)\s+(reflexes|skills|precision|instincts|timing)\b/i },
  { id: 'delivers', name: '[Title] delivers fast-paced/intense...', test: (s) => /^\S.*?\bdelivers?\s+(fast-paced|intense|dynamic|fluid|exciting)\b/i },
  { id: 'built_around', name: 'Built around [mechanic], [Title]...', test: (s) => /^built\s+around\b/i },
  { id: 'set_across', name: 'Set across [setting], [Title]...', test: (s) => /^set\s+across\b/i },
  { id: 'is_a', name: '[Title] is an engaging/tactical...', test: (s) => /^\S.*?\bis\s+(an?|the)\s+[a-z]+-?[a-z]*\s+(experience|game|brawler|racer|puzzler|platformer|adventure|simulator|shooter)\b/i },
  { id: 'commanding', name: 'Commanding/Guiding [subject] in [Title]...', test: (s) => /^(commanding|guiding|controlling|leading)\s+.*?in\b/i },
];

const P2_PATTERNS = [
  { id: 'timing', name: 'Precision timing and disciplined execution...', test: (s) => /^(precision timing|timing your|disciplined timing)\b/i },
  { id: 'balance', name: 'Success demands a disciplined balance...', test: (s) => /^success\s+demands\s+a\s+disciplined\s+balance\b/i },
  { id: 'hazards', name: 'Hazards throughout each stage penalize...', test: (s) => /^hazards\s+throughout\s+(each|the)\s+stage\b/i },
  { id: 'studying', name: 'Studying obstacle layouts and reading cues...', test: (s) => /^studying\s+(obstacle|enemy|stage|opponent)\b/i },
  { id: 'momentum', name: 'Maintaining steady forward momentum...', test: (s) => /^maintaining\s+(steady|consistent|forward)\s+momentum\b/i },
  { id: 'controls', name: 'Smooth keyboard and touch controls provide...', test: (s) => /^smooth\s+(keyboard|touch|control)\b/i },
  { id: 'tactical', name: 'Keep a sharp eye on spacing and positioning...', test: (s) => /^keep\s+a\s+(sharp|close)\s+eye\b/i },
  { id: 'later_stages', name: 'Later challenges introduce tighter margins...', test: (s) => /^later\s+(challenges|stages|levels)\s+introduce\b/i },
  { id: 'gerund', name: '[Gerund phrase] requires/demands...', test: (s) => /^[A-Z][a-z]+ing\b.*?\b(requires|demands|centers on|relies on)\b/i },
];

module.exports = {
  P1_PATTERNS,
  P2_PATTERNS,
  activeSlugs,
  generateFactsUsed,
};
