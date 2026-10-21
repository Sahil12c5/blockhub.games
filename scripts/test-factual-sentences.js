const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const {
  cleanFeedText,
  extractControls,
  sanitizeVocabulary
} = require('./lib/individual-engine.js');

const {
  get6WordRuns,
  validateQualityGates
} = require('./lib/validator.js');

// Test factual transformation on sample games
const sampleSlugs = [
  'bus-mania-parking-puzzle',
  'santa-matching-game',
  'super-goal-keeper',
  'splatcha',
  'real-advanced-monster-truck-simulator',
  'survivorio-battle',
  'extreme-gear-shift-racing',
  'online-kitpvp-50vs50',
  'racing-portal',
  'authentic-footballthe-brazil-world-cup'
];

sampleSlugs.forEach(slug => {
  const g = topContent[slug];
  const rawDesc = cleanFeedText(g.raw_description || '');
  const sentences = rawDesc.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 15);

  console.log(`\n========================================`);
  console.log(`SLUG: ${slug} | TITLE: ${g.title}`);
  console.log(`Feed sentences (${sentences.length}):`);
  sentences.slice(0, 4).forEach((s, i) => console.log(`  [${i+1}] ${s.slice(0, 100)}`));
});
