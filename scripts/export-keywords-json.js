const fs = require('fs');
const path = require('path');

// 1. app/layout.js
const layoutPath = path.resolve(__dirname, '../app/layout.js');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const layoutKws = [];
const kwBlockMatch = layoutContent.match(/keywords:\s*\[([\s\S]*?)\]/);
if (kwBlockMatch) {
  const lines = kwBlockMatch[1].split('\n');
  for (const line of lines) {
    const trimmed = line.trim().replace(/^["']/, '').replace(/["'],?$/, '').trim();
    if (trimmed && !trimmed.startsWith('//')) {
      layoutKws.push(trimmed.toLowerCase());
    }
  }
}

// 2. app/page.js
const pageKws = [
  'free online browser games',
  'free online games hub',
  'free online games',
  'browser games',
  'unblocked games',
  'html5 games',
  'webgl web games',
  'instant play games',
  'no download games',
  'blockhub games'
];

// 3. data/categories.js
const { categories } = require('../data/categories.js');
const categoriesData = {};
categories.forEach(c => {
  const kws = []
    .concat(c.keywords || [])
    .concat(c.seoKeywords || [])
    .map(k => k.trim().toLowerCase());
  categoriesData[c.slug] = Array.from(new Set(kws));
});

// 4. data/hubs.js
const { hubs } = require('../data/hubs.js');
const hubsData = {};
hubs.forEach(h => {
  const kws = []
    .concat(h.keywords || [])
    .concat(h.seoKeywords || [])
    .map(k => k.trim().toLowerCase());
  hubsData[h.slug] = Array.from(new Set(kws));
});

// 5. data/games.js
const { games } = require('../data/games.js');
const gamesData = {};
games.forEach(g => {
  const kws = []
    .concat(g.keywords || [])
    .concat(g.seoKeywords || [])
    .map(k => k.trim().toLowerCase());
  if (kws.length > 0) {
    gamesData[g.slug] = Array.from(new Set(kws));
  }
});

// Calculate master deduplicated set
const allUniqueSet = new Set();
layoutKws.forEach(k => allUniqueSet.add(k));
pageKws.forEach(k => allUniqueSet.add(k));
Object.values(categoriesData).forEach(arr => arr.forEach(k => allUniqueSet.add(k)));
Object.values(hubsData).forEach(arr => arr.forEach(k => allUniqueSet.add(k)));
Object.values(gamesData).forEach(arr => arr.forEach(k => allUniqueSet.add(k)));

const masterList = Array.from(allUniqueSet).sort();

const result = {
  summary: {
    layoutKeywordsCount: layoutKws.length,
    layoutUnique: new Set(layoutKws).size,
    homepageKeywordsCount: pageKws.length,
    categoriesCount: Object.keys(categoriesData).length,
    categoriesKeywordsTotal: Object.values(categoriesData).reduce((sum, a) => sum + a.length, 0),
    hubsCount: Object.keys(hubsData).length,
    hubsKeywordsTotal: Object.values(hubsData).reduce((sum, a) => sum + a.length, 0),
    gamesCountWithKeywords: Object.keys(gamesData).length,
    gamesKeywordsTotal: Object.values(gamesData).reduce((sum, a) => sum + a.length, 0),
    masterUniqueKeywordsCount: masterList.length
  },
  layout: layoutKws,
  page: pageKws,
  categories: categoriesData,
  hubs: hubsData,
  games: gamesData,
  masterList: masterList
};

fs.writeFileSync(path.resolve(__dirname, '../reports/all-keywords.json'), JSON.stringify(result, null, 2), 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../reports/all-keywords-master-list.txt'), masterList.join('\n'), 'utf8');

console.log(JSON.stringify(result.summary, null, 2));

