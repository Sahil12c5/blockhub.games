const data = require('../data/top-games-content.json');
const slugs = require('../scratch-indexable-slugs.json');
const subgenres = {};
for (const s of slugs) {
  const g = data[s];
  if (!g) continue;
  const key = g.category + ' / ' + g.subgenre;
  subgenres[key] = (subgenres[key] || 0) + 1;
}
console.log(JSON.stringify(subgenres, null, 2));
