const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const top = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

// Test games across genres
const testSlugs = [
  'bus-mania-parking-puzzle',
  'santa-matching-game',
  'super-goal-keeper',
  'splatcha',
  'alien-memory',
  'real-advanced-monster-truck-simulator'
];

testSlugs.forEach(slug => {
  const g = top[slug];
  if (!g) {
    console.log(`Slug ${slug} not in top content`);
    return;
  }
  console.log(`\n=== [${slug}] ===`);
  console.log(`Title: ${g.title} | Cat: ${g.category} | Sub: ${g.subgenre}`);
  console.log(`Feed Desc: ${(g.raw_description || '').slice(0, 140)}...`);
  console.log(`Feed HowTo: ${(g.raw_how_to || '').slice(0, 100)}...`);
});
