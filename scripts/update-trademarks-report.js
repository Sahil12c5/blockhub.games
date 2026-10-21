/**
 * REGENERATE FLAGGED TRADEMARKS CSV
 * Identifies all brand-like titles using scripts/lib/trademark.js
 * and writes reports/flagged-trademarks.csv with indexable_blocked: true.
 */

const fs = require('fs');
const path = require('path');
const { rawGames } = require('../data/games.js');
const { checkTrademark } = require('./lib/trademark.js');

const CSV_PATH = path.join(__dirname, '../reports/flagged-trademarks.csv');

const rows = [
  'slug,title,category,matched_trademark,suggested_neutral_title,indexable_blocked,iframeUrl'
];

let blockedCount = 0;
const seenSlugs = new Set();

for (const game of rawGames) {
  if (seenSlugs.has(game.slug)) continue;
  seenSlugs.add(game.slug);

  const res = checkTrademark(game);
  if (res.flagged) {
    if (res.blocksIndex) blockedCount++;
    rows.push(
      `"${game.slug}","${game.title.replace(/"/g, '""')}","${game.category}","${res.term}","${res.suggestedTitle.replace(/"/g, '""')}",${res.blocksIndex},"${game.iframeUrl || ''}"`
    );
  }
}

fs.writeFileSync(CSV_PATH, rows.join('\n') + '\n', 'utf8');
console.log(`Generated reports/flagged-trademarks.csv with ${rows.length - 1} flagged games (${blockedCount} indexable_blocked).`);
