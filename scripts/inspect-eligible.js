const fs = require('fs');
const path = require('path');
const content = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/top-games-content.json'), 'utf8'));
const { rawGames, games } = require('../data/games.js');
const { checkTrademark } = require('./lib/trademark.js');

const rawMap = new Map();
for (const r of rawGames) rawMap.set(r.slug, r);
for (const g of games) if (!rawMap.has(g.slug)) rawMap.set(g.slug, g);

const eligibleSlugs = Object.keys(content).filter(s => content[s].template_version !== 'v2').sort();
console.log('=== ELIGIBLE GAMES INSPECTION ===');
console.log('Eligible count:', eligibleSlugs.length);

// Near duplicates check
const ndRaw = fs.readFileSync(path.join(__dirname, '../reports/near-duplicates.csv'), 'utf8');
const ndLines = ndRaw.trim().split(/\r?\n/).slice(1);
const eligibleSet = new Set(eligibleSlugs);
const nearDupeHits = [];
const nonCanonicalNearDupesInEligible = new Set();

for (const line of ndLines) {
  const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
  const [slugA, slugB, sim, sameEmbed, inSitemap, recAction, sugAction, canonical] = parts;
  if (eligibleSet.has(slugA) || eligibleSet.has(slugB)) {
    nearDupeHits.push({ slugA, slugB, sim, canonical });
    if (canonical && slugA !== canonical && eligibleSet.has(slugA)) {
      nonCanonicalNearDupesInEligible.add(slugA);
    }
    if (canonical && slugB !== canonical && eligibleSet.has(slugB)) {
      nonCanonicalNearDupesInEligible.add(slugB);
    }
  }
}

console.log('\nNear duplicate pairs involving eligible games:', nearDupeHits.length);
for (const h of nearDupeHits) {
  console.log(`- ${h.slugA} vs ${h.slugB} (sim: ${h.sim}) => Canonical: ${h.canonical}`);
}
console.log('\nNon-canonical near duplicates among eligible 623 games:', nonCanonicalNearDupesInEligible.size);
console.log(Array.from(nonCanonicalNearDupesInEligible));

// Trademarks check
const trademarkBlockedInEligible = [];
for (const slug of eligibleSlugs) {
  const g = content[slug];
  const tm = checkTrademark({ slug, title: g.title });
  if (tm.flagged && tm.blocksIndex) {
    trademarkBlockedInEligible.push({ slug, title: g.title, term: tm.term });
  }
}
console.log('\nTrademark blocked games among eligible 623 games:', trademarkBlockedInEligible.length);
for (const t of trademarkBlockedInEligible) {
  console.log(`- ${t.slug} (${t.title}): ${t.term}`);
}
