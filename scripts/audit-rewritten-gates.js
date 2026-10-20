const fs = require('fs');
const path = require('path');

const { rawGames, games } = require('../data/games.js');
const {
  validateQualityGates,
  get5WordShingles,
  computeJaccardSimilarity,
} = require('./lib/validator.js');
const { activeSlugs } = require('./generate-varied-prose.js');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

console.log(`Auditing ${activeSlugs.length} rewritten games against validator Quality Gates...`);

// Build shingle map
const shingleMap = {};
for (const slug of activeSlugs) {
  const item = topContent[slug];
  if (item && item.description) {
    shingleMap[slug] = get5WordShingles(item.description);
  }
}

// Build catalogSentenceCounts
const catalogSentenceCounts = new Map();
for (const slug of activeSlugs) {
  const item = topContent[slug];
  if (item && item.description) {
    const sents = item.description.split(/(?<=[.!?])\s+/);
    for (const s of sents) {
      const norm = s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
      if (norm.length > 20) {
        catalogSentenceCounts.set(norm, (catalogSentenceCounts.get(norm) || 0) + 1);
      }
    }
  }
}

let passCount = 0;
let failCount = 0;
const failureReport = [];

for (const slug of activeSlugs) {
  const game = topContent[slug];
  const res = validateQualityGates(game, shingleMap, catalogSentenceCounts);
  if (res.passed) {
    passCount++;
  } else {
    failCount++;
    failureReport.push({ slug, title: game.title, errors: res.errors });
  }
}

console.log(`\nAudit Complete:`);
console.log(`- Total Audited: ${activeSlugs.length}`);
console.log(`- Passed: ${passCount}`);
console.log(`- Failed: ${failCount}`);

if (failureReport.length > 0) {
  console.log('\nFailures:');
  console.log(JSON.stringify(failureReport, null, 2));
}
