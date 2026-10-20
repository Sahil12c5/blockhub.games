const fs = require('fs');
const path = require('path');

const { rawGames, games } = require('../data/games.js');
const { cleanTitle } = require('./test-title-cleaner.js');
const {
  validateQualityGates,
  get5WordShingles,
  computeJaccardSimilarity,
} = require('./lib/validator.js');
const { checkTrademark } = require('./lib/trademark.js');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const csvRaw = fs.readFileSync(path.join(__dirname, '../reports/indexable-games.csv'), 'utf8');
const allCsvSlugs = csvRaw.trim().split(/\r?\n/).slice(1).map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(Boolean);

// Exclude trademarks from indexability
const EXCLUDED_TRADEMARKS = new Set(['halo-platformer', 'destroy-minecraft']);
const activeSlugs = allCsvSlugs.filter(s => !EXCLUDED_TRADEMARKS.has(s));

console.log(`Rewriting prose for ${activeSlugs.length} indexable games...`);

// Let's inspect euro-truck-parking specifically
console.log('Euro truck parking exists:', !!topContent['euro-truck-parking']);
