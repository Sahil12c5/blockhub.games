const fs = require('fs');
const path = require('path');
const { games } = require('../data/games.js');
const { checkTrademark } = require('./lib/trademark.js');

const flagged = [];

for (const g of games) {
  const res = checkTrademark(g);
  if (res.flagged) {
    flagged.push({
      slug: g.slug,
      title: g.title,
      category: g.category,
      matched_trademark: res.term,
      suggested_neutral_title: res.suggestedTitle,
      indexable_blocked: res.blocksIndex,
      iframeUrl: g.iframeUrl || '',
    });
  }
}

// Sort by category, title
flagged.sort((a, b) => a.title.localeCompare(b.title));

const csvHeader = 'slug,title,category,matched_trademark,suggested_neutral_title,indexable_blocked,iframeUrl\n';
const csvRows = flagged.map(f =>
  `"${f.slug.replace(/"/g, '""')}","${f.title.replace(/"/g, '""')}","${f.category.replace(/"/g, '""')}","${f.matched_trademark.replace(/"/g, '""')}","${f.suggested_neutral_title.replace(/"/g, '""')}",${f.indexable_blocked},"${f.iframeUrl.replace(/"/g, '""')}"`
).join('\n');

const outPath = path.join(__dirname, '../reports/flagged-trademarks.csv');
fs.writeFileSync(outPath, csvHeader + csvRows + '\n', 'utf8');

console.log(`Successfully generated /reports/flagged-trademarks.csv with ${flagged.length} flagged games!`);
console.log(`Games where indexability is blocked: ${flagged.filter(f => f.indexable_blocked).length}`);
