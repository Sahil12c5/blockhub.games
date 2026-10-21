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

// 20 random scheduled games
const scheduled = Object.values(topContent).filter(g => g.status === 'PASS_SCHEDULED');
const sample = [
  scheduled[5], scheduled[25], scheduled[50], scheduled[75], scheduled[100],
  scheduled[150], scheduled[200], scheduled[250], scheduled[300], scheduled[350],
  scheduled[400], scheduled[450], scheduled[500], scheduled[550], scheduled[600]
];

console.log('Testing factual sentence extraction on 15 diverse games:\n');

sample.forEach(g => {
  const desc = cleanFeedText(g.raw_description || '');
  const sents = desc.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 15);
  console.log(`=== [${g.slug}] (${g.category} / ${g.subgenre || 'none'}) ===`);
  console.log(`Title: ${g.title}`);
  console.log(`Sentence count: ${sents.length}`);
  sents.slice(0, 3).forEach((s, idx) => {
    console.log(`  S${idx+1}: ${s.trim()}`);
  });
  console.log('');
});
