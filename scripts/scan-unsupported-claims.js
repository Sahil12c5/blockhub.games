const fs = require('fs');
const { rawGames, games } = require('../data/games.js');
const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));

const indexableCsv = fs.readFileSync('reports/indexable-games.csv', 'utf8');
const slugs = indexableCsv.trim().split('\n').slice(1).map(l => {
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : '';
}).filter(Boolean);

console.log(`Checking fact claims across ${slugs.length} games...`);

// Suspicious / unverified claim keywords to look out for
const SUSPICIOUS_WORDS = [
  'penalty points', 'jackknifing', 'chapter', 'chapters', 'story mode', 'narrative',
  'dlc', 'microtransactions', 'battle pass', 'loot box', 'ranked season',
  'tournament bracket', 'voice acting', 'cutscene', 'cutscenes'
];

const flagged = [];

for (const slug of slugs) {
  const g = topContent[slug];
  if (!g) continue;
  const desc = (g.description || '').toLowerCase();
  const raw = rawGames.find(r => r.slug.toLowerCase() === slug.toLowerCase()) || games.find(r => r.slug.toLowerCase() === slug.toLowerCase()) || {};
  const feed = ((raw.description || '') + ' ' + (raw.howToPlay || '') + ' ' + (raw.tags || '')).toLowerCase();

  for (const word of SUSPICIOUS_WORDS) {
    if (desc.includes(word) && !feed.includes(word)) {
      flagged.push({ slug, title: g.title, claim: word });
    }
  }
}

console.log(`Found ${flagged.length} unsupported claim instances:`);
console.log(flagged);
