const fs = require('fs');

const csvRaw = fs.readFileSync('reports/indexable-games.csv', 'utf8');
const lines = csvRaw.trim().split(/\r?\n/).slice(1);
const slugs = lines.map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(Boolean);

console.log('Total indexable in CSV:', slugs.length);

const excluded = ['halo-platformer', 'destroy-minecraft'];
const active155 = slugs.filter(s => !excluded.includes(s));

console.log('Active indexable slugs count:', active155.length);
console.log('Excluded trademarks:', excluded);
