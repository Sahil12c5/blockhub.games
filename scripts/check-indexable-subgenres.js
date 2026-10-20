const fs = require('fs');
const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));

const csvRaw = fs.readFileSync('reports/indexable-games.csv', 'utf8');
const slugs = csvRaw.trim().split(/\r?\n/).slice(1).map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(Boolean);

console.log(`Checking subgenre labels for ${slugs.length} indexable games...`);

const mismatches = [];

for (const slug of slugs) {
  const g = topContent[slug];
  if (!g) continue;
  const title = (g.title || '').toLowerCase();
  const sub = (g.subgenre || '').toLowerCase();

  if (slug === 'galaxy-pop' || (title.includes('pop') && sub === 'fps')) {
    mismatches.push({ slug, title: g.title, currentSubgenre: g.subgenre, correctedSubgenre: 'bubble-shooter' });
  }
}

console.log('Mismatches found among indexable games:');
console.log(mismatches);
