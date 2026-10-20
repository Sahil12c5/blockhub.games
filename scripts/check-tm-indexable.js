const fs = require('fs');
const { games } = require('../data/games.js');
const { checkTrademark } = require('./lib/trademark.js');

const csvContent = fs.readFileSync('reports/indexable-games.csv', 'utf8');
const indexableSlugs = new Set(csvContent.split('\n').slice(1).map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(Boolean));

const flagged = [];
for (const g of games) {
  const res = checkTrademark(g);
  if (res.flagged) {
    flagged.push({
      slug: g.slug,
      title: g.title,
      category: g.category,
      trademark: res.term,
      suggestedTitle: res.suggestedTitle,
      wasIndexable: indexableSlugs.has(g.slug),
    });
  }
}

console.log('Total flagged in games.js:', flagged.length);
console.log('Flagged that are currently in indexable-games.csv:');
console.log(flagged.filter(f => f.wasIndexable));
