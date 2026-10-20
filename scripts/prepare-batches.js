const fs = require('fs');
const { rawGames, games } = require('../data/games');

const slugs = JSON.parse(fs.readFileSync('scratch-indexable-slugs.json', 'utf8'));

const batchDir = './scripts/batches';
if (!fs.existsSync(batchDir)) {
  fs.mkdirSync(batchDir, { recursive: true });
}

console.log(`Preparing factual dossiers for all ${slugs.length} indexable games...`);

const batchSize = 25;
let currentBatch = [];
let batchNum = 1;

slugs.forEach((slug, idx) => {
  const raw = rawGames.find(g => g.slug === slug) || {};
  const enriched = games.find(g => g.slug === slug) || {};

  const dossier = {
    index: idx + 1,
    slug,
    title: raw.title || enriched.title || slug,
    category: raw.category || enriched.category || 'Arcade',
    subgenre: enriched.subgenre || '',
    raw_description: raw.description || '',
    raw_how_to: raw.howToPlay || '',
    controls: raw.controls || enriched.controls || [],
    tags: raw.tags || []
  };

  currentBatch.push(dossier);

  if (currentBatch.length === batchSize || idx === slugs.length - 1) {
    fs.writeFileSync(
      `${batchDir}/batch-${batchNum}.json`,
      JSON.stringify(currentBatch, null, 2),
      'utf8'
    );
    console.log(`Saved Batch ${batchNum} with ${currentBatch.length} games (index ${idx - currentBatch.length + 2} to ${idx + 1})`);
    batchNum++;
    currentBatch = [];
  }
});

console.log('All dossiers prepared successfully.');
