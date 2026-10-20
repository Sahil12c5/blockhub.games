const fs = require('fs');
const { rawGames, games } = require('../data/games.js');
const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));

console.log('Checking subgenres across topContent...');

const mismatches = [];

for (const [slug, item] of Object.entries(topContent)) {
  const title = (item.title || '').toLowerCase();
  const subgenre = (item.subgenre || '').toLowerCase();
  const category = (item.category || '').toLowerCase();
  const rawG = rawGames.find(r => r.slug.toLowerCase() === slug.toLowerCase()) || games.find(r => r.slug.toLowerCase() === slug.toLowerCase()) || {};
  const feedText = ((rawG.description || '') + ' ' + (rawG.howToPlay || '') + ' ' + (rawG.tags || '')).toLowerCase();

  // Check specific mismatches
  // 1. Bubble shooter mislabeled as fps / shooter / sniper
  if ((title.includes('bubble') || title.includes('pop') || feedText.includes('bubble shooter') || feedText.includes('match 3 bubbles')) && ['fps', 'sniper'].includes(subgenre)) {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'Bubble shooter mislabeled as ' + item.subgenre, suggestedSubgenre: 'bubble-shooter' });
  }
  // 2. Parking games mislabeled as something else, or non-parking labeled as parking
  if ((title.includes('parking') || title.includes('park ')) && subgenre !== 'parking') {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'Parking title but subgenre is ' + item.subgenre, suggestedSubgenre: 'parking' });
  }
  if (subgenre === 'parking' && !title.includes('park') && !feedText.includes('parking') && !feedText.includes('park your')) {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'Subgenre is parking but no parking mentioned', suggestedSubgenre: 'driving' });
  }
  // 3. Mahjong / Solitaire / Card / Chess
  if (title.includes('mahjong') && subgenre !== 'mahjong') {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'Mahjong title with subgenre ' + item.subgenre, suggestedSubgenre: 'mahjong' });
  }
  if (title.includes('solitaire') && subgenre !== 'solitaire') {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'Solitaire title with subgenre ' + item.subgenre, suggestedSubgenre: 'card' });
  }
  // 4. Runner / Endless runner
  if ((title.includes('runner') || title.includes('run 3d') || feedText.includes('endless runner')) && ['fps', 'sniper', 'fighter'].includes(subgenre)) {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'Runner game mislabeled as ' + item.subgenre, suggestedSubgenre: 'runner' });
  }
  // 5. Sniper vs general shooter or non-sniper labeled sniper
  if (subgenre === 'sniper' && !title.includes('sniper') && !feedText.includes('sniper')) {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'Subgenre is sniper but no sniper mentioned', suggestedSubgenre: 'fps' });
  }
  // 6. Check galaxy-pop specifically
  if (slug === 'galaxy-pop') {
    mismatches.push({ slug, title: item.title, category: item.category, currentSubgenre: item.subgenre, reason: 'galaxy-pop check', suggestedSubgenre: 'bubble-shooter' });
  }
}

// Remove duplicates
const uniqueMismatches = [];
const seenSlugs = new Set();
for (const m of mismatches) {
  if (!seenSlugs.has(m.slug)) {
    seenSlugs.add(m.slug);
    uniqueMismatches.push(m);
  }
}

console.log('Total mismatches found:', uniqueMismatches.length);
console.log(JSON.stringify(uniqueMismatches, null, 2));
