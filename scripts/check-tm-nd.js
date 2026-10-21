// scripts/check-tm-nd.js
const fs = require('fs');
const tc = JSON.parse(fs.readFileSync('./data/top-games-content.json', 'utf8'));
const TM_PATH = './reports/flagged-trademarks.csv';
const trademarkBlockedSlugs = new Set();
if (fs.existsSync(TM_PATH)) {
  const tmLines = fs.readFileSync(TM_PATH, 'utf8').trim().split(/\r?\n/).slice(1);
  for (const line of tmLines) {
    const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
    if (parts[5] === 'true' && parts[0]) trademarkBlockedSlugs.add(parts[0]);
  }
}
const ND_PATH = './reports/near-duplicates.csv';
const nearDupeSlugs = new Set();
if (fs.existsSync(ND_PATH)) {
  const ndLines = fs.readFileSync(ND_PATH, 'utf8').trim().split(/\r?\n/).slice(1);
  for (const line of ndLines) {
    const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
    const [slugA, slugB, sim, sameEmbed, inSitemap, recAction, sugAction, canonical] = parts;
    if (canonical) {
      if (slugA && slugA !== canonical) nearDupeSlugs.add(slugA);
      if (slugB && slugB !== canonical) nearDupeSlugs.add(slugB);
    }
  }
}

const scheduled = Object.keys(tc).filter(s => tc[s].status === 'PASS_SCHEDULED');
let tmInSched = [];
let ndInSched = [];
scheduled.forEach(s => {
  if (trademarkBlockedSlugs.has(s)) tmInSched.push(s);
  if (nearDupeSlugs.has(s)) ndInSched.push(s);
});
console.log('Trademarks in PASS_SCHEDULED:', tmInSched.length, tmInSched);
console.log('Near duplicates in PASS_SCHEDULED:', ndInSched.length, ndInSched);
