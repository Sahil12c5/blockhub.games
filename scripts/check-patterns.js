const fs = require('fs');
const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));

const csvRaw = fs.readFileSync('reports/indexable-games.csv', 'utf8');
const lines = csvRaw.trim().split(/\r?\n/).slice(1);
const slugs = lines.map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(s => s && s !== 'halo-platformer' && s !== 'destroy-minecraft');

console.log(`Analyzing current prose patterns for ${slugs.length} games...`);

const p1Openers = [];
const p2Openers = [];
let primaryObjCount = 0;

for (const slug of slugs) {
  const item = topContent[slug];
  if (!item || !item.description) continue;
  const paras = item.description.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  
  if (paras[0]) {
    const firstSent = paras[0].split(/(?<=[.!?])\s+/)[0];
    p1Openers.push(firstSent);
    if (/the primary objective is to/i.test(paras[0])) {
      primaryObjCount++;
    }
  }
  if (paras[1]) {
    const firstSent = paras[1].split(/(?<=[.!?])\s+/)[0];
    p2Openers.push(firstSent);
  }
}

console.log(`"The primary objective is to" appears in: ${primaryObjCount} / ${slugs.length} (${(primaryObjCount / slugs.length * 100).toFixed(1)}%)`);

// Classify P2 openers by structure
let p2GerundRequiresCount = 0;
for (const sent of p2Openers) {
  if (/^[a-z]+ing\b.*?\b(requires|demands|centers on|relies on)\b/i.test(sent)) {
    p2GerundRequiresCount++;
  }
}

console.log(`P2 opening with [Gerund] requires/demands/etc: ${p2GerundRequiresCount} / ${slugs.length} (${(p2GerundRequiresCount / slugs.length * 100).toFixed(1)}%)`);
console.log('\nSample P1 openers:');
p1Openers.slice(0, 10).forEach(s => console.log(' - ' + s));
console.log('\nSample P2 openers:');
p2Openers.slice(0, 10).forEach(s => console.log(' - ' + s));
