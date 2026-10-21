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

const { validateQualityGates, get6WordRuns } = require('./lib/validator.js');

// Test 10 scheduled games
const scheduled = Object.values(topContent).filter(g => g.status === 'PASS_SCHEDULED').slice(0, 10);

console.log('Testing 10 scheduled games...');
for (const g of scheduled) {
  const profile = detectTrueProfile(g.title, g.category, g.subgenre, g.raw_description, g.raw_how_to);
  const controls = extractControls(g.raw_how_to, g.howToPlay, profile);
  console.log(`- ${g.slug} (${g.category} / ${g.subgenre}) -> profile:`, Object.entries(profile).filter(([k, v]) => v).map(([k]) => k).join(', '), '| controls:', controls.length);
}
