const fs = require('fs');
const topContent = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));

const samples = [
  'ragdoll-survivor',
  'euro-truck-parking',
  'galaxy-pop',
  'tactical-response-team',
  'referee-simulator-3d',
  'screw-nuts-snap-puzzle',
  'shadow-fist-kung-fu',
  'storm-dash',
  'skyblock-3d',
  'apex-combat'
];

for (const s of samples) {
  const g = topContent[s];
  console.log('------------------------------------------------------------');
  console.log(`### ${g.title} (${g.category} / ${g.subgenre || 'general'}) — ${g.word_count} words`);
  console.log(`**Facts Used:** \`${g.facts_used}\`\n`);
  console.log(g.description);
  console.log('\n');
}
