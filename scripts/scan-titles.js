const fs = require('fs');
const { games } = require('../data/games.js');
const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));

console.log('Total games in games.js:', games.length);
console.log('Total games in topContent:', Object.keys(topContent).length);

const dirtyTitles = [];

for (const g of games) {
  const orig = g.title || '';
  let issues = [];
  if (/\s{2,}/.test(orig)) issues.push('multiple_spaces');
  if (/[a-z]/.test(orig[0])) issues.push('lowercase_start');
  if (/\b(2d|3d|fps|rpg|pvp|pve|io)\b/.test(orig)) {
    // Check if not uppercase
    const m = orig.match(/\b(2d|3d|fps|rpg|pvp|pve|io)\b/);
    if (m) issues.push('lowercase_acronym_' + m[0]);
  }
  // Check lowercase words in title
  const words = orig.split(/\s+/);
  for (const w of words) {
    if (/^[a-z]+$/.test(w) && !['a','an','the','and','or','of','in','on','at','to','for','vs','v'].includes(w.toLowerCase())) {
      issues.push('lowercase_word_' + w);
    }
  }
  if (issues.length > 0) {
    dirtyTitles.push({ slug: g.slug, title: orig, issues });
  }
}

console.log('Games with title issues in games.js:', dirtyTitles.length);
console.log('Sample issues:');
console.log(dirtyTitles.slice(0, 30));
