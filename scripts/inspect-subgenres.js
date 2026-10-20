const fs = require('fs');
const path = require('path');
const { rawGames, games } = require('../data/games.js');
const { decodeHtmlEntities, cleanText, detectSubgenre } = require('./lib/facts.js');

const rawMap = new Map();
for (const r of rawGames) rawMap.set(r.slug, r);
for (const g of games) if (!rawMap.has(g.slug)) rawMap.set(g.slug, g);

const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));
const eligible = Object.keys(topContent).filter(s => topContent[s].template_version !== 'v2').sort();

const subgenreCounts = {};
for (const s of eligible) {
  const raw = rawMap.get(s) || {};
  const title = decodeHtmlEntities(raw.title || s).trim();
  const cat = raw.category || topContent[s].category || 'Arcade';
  const desc = cleanText(raw.description || '');
  const sub = detectSubgenre(title, cat, desc);
  subgenreCounts[sub] = (subgenreCounts[sub] || 0) + 1;
}

console.log('Subgenre distribution across 623 eligible games:');
console.log(Object.entries(subgenreCounts).sort((a,b) => b[1] - a[1]));
