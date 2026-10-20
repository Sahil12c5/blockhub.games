const fs = require('fs');
const indexable = new Set(require('../scratch-indexable-slugs.json'));
const content = fs.readFileSync('reports/near-duplicates.csv', 'utf8').trim().split('\n').slice(1);

console.log('Top near-duplicate pairs (similarity >= 0.98):');
let count = 0;
for (const line of content) {
  const parts = line.split(',').map(s => s.replace(/"/g, '').trim());
  const [slugA, slugB, sim, action, canon] = parts;
  if (parseFloat(sim) >= 0.98) {
    count++;
    const aIdx = indexable.has(slugA);
    const bIdx = indexable.has(slugB);
    console.log(`${count}. [${sim}] ${slugA} (idx:${aIdx}) vs ${slugB} (idx:${bIdx}) => Canonical: ${canon}`);
  }
}
console.log(`Total 0.98-1.0 pairs: ${count}`);
