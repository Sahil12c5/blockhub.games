const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const top = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

// Test diverse games
const testSlugs = [
  'bus-mania-parking-puzzle',
  'santa-matching-game',
  'super-goal-keeper',
  'splatcha',
  'real-advanced-monster-truck-simulator',
  'survivorio-battle',
  'extreme-gear-shift-racing',
  'online-kitpvp-50vs50',
  'racing-portal',
  'authentic-footballthe-brazil-world-cup'
];

testSlugs.forEach(slug => {
  const g = top[slug];
  console.log(`\n========================================`);
  console.log(`SLUG: ${slug} | CAT: ${g.category} | SUB: ${g.subgenre}`);
  console.log(`TITLE: ${g.title}`);
  console.log(`RAW DESC: ${g.raw_description}`);
  console.log(`RAW HOWTO: ${g.raw_how_to}`);
});
