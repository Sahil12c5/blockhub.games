const fs = require('fs');
const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));

const csvRaw = fs.readFileSync('reports/indexable-games.csv', 'utf8');
const slugs = csvRaw.trim().split(/\r?\n/).slice(1).map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(s => s && s !== 'halo-platformer' && s !== 'destroy-minecraft');

let minW = 999;
let maxW = 0;
let totalW = 0;
const counts = [];

for (const slug of slugs) {
  const item = topContent[slug];
  if (!item || !item.description) continue;
  const paras = item.description.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  // Without paragraph 3:
  const twoParas = paras.slice(0, 2).join('\n\n');
  const wc = twoParas.split(/\s+/).filter(Boolean).length;
  if (wc < minW) minW = wc;
  if (wc > maxW) maxW = wc;
  totalW += wc;
  counts.push(wc);
}

console.log(`Word count stats for 2 paragraphs across ${slugs.length} games:`);
console.log(`Min: ${minW}, Max: ${maxW}, Avg: ${(totalW / slugs.length).toFixed(1)}`);
console.log(`Count < 150 words: ${counts.filter(c => c < 150).length}`);
console.log(`Count 150-180 words: ${counts.filter(c => c >= 150 && c < 180).length}`);
console.log(`Count 180-240 words: ${counts.filter(c => c >= 180 && c <= 240).length}`);
console.log(`Count > 240 words: ${counts.filter(c => c > 240).length}`);
